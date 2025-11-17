<?php

namespace App\Http\Controllers;

use App\Models\Internacao;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Leito;

class InternacaoController extends Controller
{
    /**
     * Lista todas as internações com filtros
     * GET /api/internacoes
     */
    public function index(Request $request): JsonResponse
    {
        $query = Internacao::with(['paciente', 'leito', 'atendimentos.categoriaRisco', 'desfecho.recemNascidos']);
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('paciente_id')) {
            $query->where('paciente_id', $request->paciente_id);
        }
        
        $internacoes = $query->get();
        return response()->json($internacoes);
    }
    
    /**
     * Dashboard de Leitos - Internações Ativas
     * GET /api/internacoes/ativas
     */
    public function ativas(): JsonResponse
    {
        $leitosComPacientes = Leito::with([
            'internacaoAtiva.paciente',
            'internacaoAtiva.categoriaRiscoAtual'
        ])->get();
        
        return response()->json($leitosComPacientes);
    }
    
    /**
     * Cria nova internação
     * POST /api/internacoes
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'leito_id' => 'required|exists:leitos,id',
            'motivo_internacao' => 'required|string',
            'data_entrada' => 'required|date'
        ]);
        
        $internacao = Internacao::create([
            ...$validatedData,
            'status' => 'ativa'
        ]);
        
        return response()->json($internacao->load(['paciente', 'leito']), 201);
    }

    /**
     * Prontuário Completo
     * GET /api/internacoes/{internacao}
     */
    public function show(Internacao $internacao): JsonResponse
    {
        $internacao->load([
            'paciente.condicoesPatologicas', 'paciente.gestacoesAnteriores',
            'leito',
            'atendimentos' => function ($query) {
                $query->with('profissional', 'categoriaRisco', 'examesLaboratoriais', 'medicamentosAdministrados', 'procedimentosRealizados', 'ocorrenciasClinicas')
                      ->latest();
            },
            'desfecho.recemNascidos',
            'alta.profissional'
        ]);
        return response()->json($internacao);
    }

    /**
     * Alta Administrativa
     * POST /api/internacoes/{internacao}/alta
     */

    public function darAlta(Request $request, Internacao $internacao): JsonResponse
    {
        if ($internacao->status !== 'ativa') {
            return response()->json(['message' => 'Esta internação não está ativa.'], 409);
        }
        // Verifica se já ocorreu o desfecho clínico, o que é um pré-requisito para a alta
        if (!$internacao->desfecho) {
            return response()->json(['message' => 'É preciso registrar o desfecho clínico (parto, etc.) antes de dar alta.'], 422);
        }

        $validatedData = $request->validate([
            'resumo_alta' => 'nullable|string',
            'recomendacoes_pos_alta' => 'nullable|string',
        ]);

        try {
            $alta = DB::transaction(function () use ($internacao, $validatedData) {
                // 1. Cria o registro de alta
                $alta = $internacao->alta()->create([
                    'usuario_id' => Auth::user()->id ?? 1,
                    'data_hora' => now(),
                    'resumo_alta' => $validatedData['resumo_alta'] ?? null,
                    'orientacoes' => $validatedData['recomendacoes_pos_alta'] ?? null,
                ]);

                // 2. Atualiza a internação (finaliza e libera o leito)
                $internacao->status = 'finalizada';
                $internacao->leito_id = null;
                $internacao->save();

                return $alta;
            });

            return response()->json(['message' => 'Alta realizada com sucesso!', 'data' => $alta]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao processar a alta: ' . $e->getMessage()], 500);
        }
    }
    
    /**
     * Atualiza internação
     * PUT /api/internacoes/{internacao}
     */
    public function update(Request $request, Internacao $internacao): JsonResponse
    {
        $validatedData = $request->validate([
            'leito_id' => 'nullable|exists:leitos,id',
            'motivo_internacao' => 'sometimes|string',
            'status' => 'sometimes|in:ativa,finalizada,transferida'
        ]);
        
        $internacao->update($validatedData);
        
        return response()->json($internacao->load(['paciente', 'leito']));
    }
    
    /**
     * Remove internação
     * DELETE /api/internacoes/{internacao}
     */
    public function destroy(Internacao $internacao): JsonResponse
    {
        if ($internacao->status === 'ativa') {
            return response()->json(['message' => 'Não é possível excluir internação ativa'], 422);
        }
        
        $internacao->delete();
        
        return response()->json(['message' => 'Internação removida com sucesso']);
    }

}
