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
     * Dashboard de Leitos
     * GET /api/internacoes/ativas
     */
    public function index(): JsonResponse
    {
        $leitosComPacientes = Leito::with([
            'internacaoAtiva.paciente',
            'internacaoAtiva.categoriaRiscoAtual'
        ])->get();
        
        return response()->json($leitosComPacientes);
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
                    'usuario_id' => Auth::id() ?? 1,
                    'data_hora_alta' => now(),
                    'resumo_alta' => $validatedData['resumo_alta'] ?? null,
                    'recomendacoes_pos_alta' => $validatedData['recomendacoes_pos_alta'] ?? null,
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

}
