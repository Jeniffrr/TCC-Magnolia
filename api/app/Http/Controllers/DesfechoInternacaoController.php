<?php

namespace App\Http\Controllers;

use App\Models\Internacao;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class DesfechoInternacaoController extends Controller
{
    private const TIPOS_DESFECHO = [
        'Parto',
        'Abortamento Completo',
        'Abortamento Incompleto / Retido',
        'Abortamento Terapêutico',
        'Natimorto',
        'Gravidez ectópica'
    ];

    private const TIPOS_PARTO = ['Normal', 'Cesariana', 'Fórceps', 'Vácuo'];

    private const SEXOS = ['Masculino', 'Feminino', 'Indeterminado'];
    /**
     * Registra o desfecho clínico de uma internação (Parto, Aborto, etc).
     *
     * POST /api/internacoes/{internacao}/desfecho
     *
     * @param Request $request
     * @param Internacao $internacao
     * @return JsonResponse
     */
    public function store(Request $request, Internacao $internacao): JsonResponse
    {
        Log::info('Dados recebidos:', $request->all());
        
        // 1. Verifica se a internação já não tem um desfecho registrado
        if ($internacao->desfecho) {
            return response()->json([
                'message' => 'Esta internação já possui um desfecho clínico registrado.'
            ], 409); // 409 Conflict
        }
        
        // 2. Validação dos dados
        try {
            $validatedData = $request->validate([
                'tipo' => ['required', Rule::in(self::TIPOS_DESFECHO)],
                'data_hora_evento' => 'required|date',
                'semana_gestacional' => 'required|integer|min:4|max:45',
                'observacoes' => 'nullable|string',
                'tipo_parto' => ['nullable', 'required_if:tipo,Parto', Rule::in(self::TIPOS_PARTO)],
                'recem_nascidos' => 'nullable|required_if:tipo,Parto|array|min:1',
                'recem_nascidos.*.sexo' => ['required', Rule::in(self::SEXOS)],
                'recem_nascidos.*.peso' => 'required|numeric|min:0.1',
                'recem_nascidos.*.altura' => 'required|integer|min:20',
                'recem_nascidos.*.apgar_1_min' => 'required|integer|min:0|max:10',
                'recem_nascidos.*.apgar_5_min' => 'required|integer|min:0|max:10',
                'recem_nascidos.*.observacoes_iniciais' => 'nullable|string',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Erro de validação:', ['errors' => $e->errors()]);
            throw $e;
        }

        Log::info('Dados validados:', $validatedData);

        // 3. Executa a criação dentro de uma transação segura
        try {
            $desfecho = DB::transaction(function () use ($internacao, $validatedData) {
                
                // 3.1. Cria o registro de Desfecho
                $desfecho = $internacao->desfecho()->create([
                    'usuario_id' => Auth::user()->id ?? 1,
                    'tipo' => $validatedData['tipo'],
                    'data_hora_evento' => $validatedData['data_hora_evento'],
                    'semana_gestacional' => $validatedData['semana_gestacional'],
                    'tipo_parto' => $validatedData['tipo_parto'] ?? null,
                    'observacoes' => $validatedData['observacoes'] ?? null,
                ]);

                // 3.2. Cria os Recém-Nascidos (se for um parto)
                if ($validatedData['tipo'] === 'Parto' && !empty($validatedData['recem_nascidos'])) {
                    
                    foreach ($validatedData['recem_nascidos'] as $rnData) {
                        $desfecho->recemNascidos()->create([
                            'sexo' => $rnData['sexo'],
                            'peso' => $rnData['peso'],
                            'altura' => $rnData['altura'],
                            'apgar_1_min' => $rnData['apgar_1_min'],
                            'apgar_5_min' => $rnData['apgar_5_min'],
                            'observacoes_iniciais' => $rnData['observacoes_iniciais'] ?? null,
                            'data_hora_nascimento' => $validatedData['data_hora_evento'], // Assume a mesma data/hora do parto
                        ]);
                    }
                }
                
                // Carrega o relacionamento para retornar os dados completos
                return $desfecho->load('recemNascidos');
            });

            // 4. Retorna a resposta de sucesso
            return response()->json([
                'message' => 'Desfecho clínico registrado com sucesso!',
                'data' => $desfecho
            ], 201); // 201 Created

        } catch (\Exception $e) {
            Log::error('Erro ao criar desfecho:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Ocorreu um erro ao registrar o desfecho.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}