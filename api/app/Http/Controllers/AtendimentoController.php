<?php

namespace App\Http\Controllers;

use App\Models\Atendimento;
use App\Models\Internacao;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Traits\CalculaRiscoTrait;

class AtendimentoController extends Controller
{
    use CalculaRiscoTrait; 

    /**
     * Lista todos os atendimentos (evoluções) de uma internação específica.
     * GET /api/internacoes/{internacao}/atendimentos
     */
    public function index(Internacao $internacao): JsonResponse
    {
        $atendimentos = $internacao->atendimentos()
                                   ->with(
                                       'profissional', 
                                       'categoriaRisco', 
                                       'examesLaboratoriais', 
                                       'medicamentosAdministrados', 
                                       'procedimentosRealizados', 
                                       'ocorrenciasClinicas'
                                   )
                                   ->latest('data_hora') // Do mais novo para o mais antigo
                                   ->get();
        return response()->json($atendimentos);
    }

    /**
     * Registra um novo atendimento (evolução) para uma internação.
     * POST /api/internacoes/{internacao}/atendimentos
     */
    public function store(Request $request, Internacao $internacao): JsonResponse
    {
        // 1. Valida os dados que estão sendo enviados NESTE atendimento
        $validatedData = $request->validate([
            'pressao_sistolica' => 'nullable|integer',
            'pressao_diastolica' => 'nullable|integer',
            'frequencia_cardiaca' => 'nullable|integer',
            'temperatura' => 'nullable|numeric',
            'frequencia_respiratoria' => 'nullable|integer',
            'evolucao_maternidade' => 'nullable|string',
            'avaliacao_fetal' => 'nullable|string',
            'bcf' => 'nullable|integer',
            'movimentos_fetais_presentes' => 'nullable|boolean',
            'altura_uterina' => 'nullable|integer',

            // Validação dos arrays satélite
            'exames_laboratoriais' => 'nullable|array',
            'exames_laboratoriais.*.nome' => 'required|string',
            'exames_laboratoriais.*.resultado' => 'nullable|string',
            'exames_laboratoriais.*.data_exame' => 'required|date',
            
            'medicamentos_administrados' => 'nullable|array',
            'medicamentos_administrados.*.nome_medicacao' => 'required|string',
            'medicamentos_administrados.*.dosagem' => 'required|string',
            'medicamentos_administrados.*.frequencia' => 'required|string',
            
            'procedimentos_realizados' => 'nullable|array',
            'procedimentos_realizados.*.nome_procedimento' => 'required|string',
            'procedimentos_realizados.*.observacoes' => 'nullable|string',

            'ocorrencias_clinicas' => 'nullable|array',
            'ocorrencias_clinicas.*.descricao' => 'required|string',
            'ocorrencias_clinicas.*.data_ocorrencia' => 'required|date',
        ]);

        // 2. BUSCA OS DADOS HISTÓRICOS PARA O CÁLCULO DE RISCO
        // O Trait precisa dos dados de base da paciente (idade, histórico)
        $paciente = $internacao->paciente;
        
        $dadosHistoricos = [
            'data_nascimento' => $paciente->data_nascimento,
            'motivo_internacao' => $internacao->motivo_internacao,
            'condicoes_patologicas' => $paciente->condicoesPatologicas()->pluck('id')->toArray(),
            'gestacoes_anteriores' => $paciente->gestacoesAnteriores()->get()->toArray(),
            'alergias' => $paciente->alergias,
            'medicamentos_continuos' => $paciente->medicamentos_continuos,
        ];

        // 3. Combina os dados históricos com os dados clínicos DESTE atendimento
        $dadosParaRisco = array_merge($dadosHistoricos, $validatedData);

        // 4. CALCULA O RISCO desta nova evolução
        $categoriaRiscoId = $this->calcularCategoriaRisco($dadosParaRisco);

        // 5. SALVA O NOVO ATENDIMENTO E SEUS SATÉLITES
        try {
            $atendimento = DB::transaction(function () use ($internacao, $validatedData, $categoriaRiscoId) {
                
                // Cria o atendimento principal
                $atendimento = $internacao->atendimentos()->create([
                    'usuario_id' => Auth::id(),
                    'data_hora' => now(),
                    'categoria_risco_id' => $categoriaRiscoId, // <-- Risco recalculado
                    'pressao_sistolica' => $validatedData['pressao_sistolica'] ?? null,
                    'pressao_diastolica' => $validatedData['pressao_diastolica'] ?? null,
                    'frequencia_cardiaca' => $validatedData['frequencia_cardiaca'] ?? null,
                    'temperatura' => $validatedData['temperatura'] ?? null,
                    'frequencia_respiratoria' => $validatedData['frequencia_respiratoria'] ?? null,
                    'evolucao_maternidade' => $validatedData['evolucao_maternidade'] ?? null,
                    'avaliacao_fetal' => $validatedData['avaliacao_fetal'] ?? null,
                    'bcf' => $validatedData['bcf'] ?? null,
                    'movimentos_fetais_presentes' => $validatedData['movimentos_fetais_presentes'] ?? null,
                    'altura_uterina' => $validatedData['altura_uterina'] ?? null,
                ]);

                // Salva os dados satélite (se foram enviados)
                if (!empty($validatedData['exames_laboratoriais'])) {
                    $atendimento->examesLaboratoriais()->createMany($validatedData['exames_laboratoriais']);
                }
                if (!empty($validatedData['medicamentos_administrados'])) {
                    $atendimento->medicamentosAdministrados()->createMany($validatedData['medicamentos_administrados']);
                }
                if (!empty($validatedData['procedimentos_realizados'])) {
                    $atendimento->procedimentosRealizados()->createMany($validatedData['procedimentos_realizados']);
                }
                if (!empty($validatedData['ocorrencias_clinicas'])) {
                    $atendimento->ocorrenciasClinicas()->createMany($validatedData['ocorrencias_clinicas']);
                }

                return $atendimento;
            });

            // Carrega os relacionamentos para a resposta JSON
            $atendimento->load('examesLaboratoriais', 'medicamentosAdministrados', 'procedimentosRealizados', 'ocorrenciasClinicas');
            
            return response()->json([
                'message' => 'Evolução registrada com sucesso!',
                'data' => $atendimento
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao registrar evolução.', 
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exibe um atendimento (evolução) específico.
     * GET /api/atendimentos/{atendimento}
     */
    public function show(Atendimento $atendimento): JsonResponse
    {
        // Carrega todos os "filhos" deste atendimento
        $atendimento->load(
            'profissional', 
            'categoriaRisco', 
            'examesLaboratoriais', 
            'medicamentosAdministrados', 
            'procedimentosRealizados', 
            'ocorrenciasClinicas'
        );
        
        return response()->json($atendimento);
    }
}