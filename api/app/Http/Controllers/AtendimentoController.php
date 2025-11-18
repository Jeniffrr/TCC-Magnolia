<?php

namespace App\Http\Controllers;

use App\Models\Atendimento;
use App\Models\Internacao;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use app\Http\Traits\CalculaRiscoTrait;
use App\Http\Traits\AuditoriaTrait;

class AtendimentoController extends Controller
{
    use CalculaRiscoTrait;
    use AuditoriaTrait; 

    /**
     * Lista todos os atendimentos com filtros
     * GET /api/atendimentos
     */
    public function index(Request $request): JsonResponse
    {
        $query = Atendimento::with(['usuario', 'categoriaRisco', 'internacao.paciente']);
        
        if ($request->has('internacao_id')) {
            $query->where('internacao_id', $request->internacao_id);
        }
        
        if ($request->has('limit')) {
            $query->limit($request->limit);
        }
        
        $atendimentos = $query->latest('data_hora')->get();
        return response()->json($atendimentos);
    }
    
    /**
     * Lista todos os atendimentos (evoluções) de uma internação específica.
     * GET /api/internacoes/{internacao}/atendimentos
     */
    public function byInternacao(Internacao $internacao): JsonResponse
    {
        $atendimentos = $internacao->atendimentos()
                                   ->with([
                                       'usuario' => function($query) {
                                           $query->withoutGlobalScopes();
                                       },
                                       'categoriaRisco', 
                                       'examesLaboratoriais', 
                                       'medicamentosAdministrados', 
                                       'procedimentosRealizados',
                                       'ocorrenciasClinicas'
                                   ])
                                   ->latest('data_hora')
                                   ->get();
        return response()->json($atendimentos);
    }
    
    /**
     * Lista atendimentos de um paciente específico
     * GET /api/pacientes/{paciente}/atendimentos
     */
    public function byPaciente($pacienteId, Request $request): JsonResponse
    {
        $query = Atendimento::whereHas('internacao', function($q) use ($pacienteId) {
            $q->where('paciente_id', $pacienteId);
        })->with(['usuario', 'categoriaRisco']);
        
        if ($request->has('limit')) {
            $query->limit($request->limit);
        }
        
        $atendimentos = $query->latest('data_hora')->get();
        return response()->json($atendimentos);
    }

    /**
     * Cria novo atendimento
     * POST /api/atendimentos
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'internacao_id' => 'required|exists:internacoes,id',
            'categoria_risco_id' => 'required|exists:categoria_riscos,id',
            'data_hora' => 'required|date',
            'pressao_sistolica' => 'nullable|integer',
            'pressao_diastolica' => 'nullable|integer',
            'frequencia_cardiaca' => 'nullable|integer',
            'temperatura' => 'nullable|numeric',
            'evolucao_maternidade' => 'nullable|string',
            'avaliacao_fetal' => 'nullable|string'
        ]);
        
        $atendimento = Atendimento::create([
            ...$validatedData,
            'usuario_id' => Auth::id() ?? 1
        ]);
        
        return response()->json($atendimento->load(['usuario', 'categoriaRisco']), 201);
    }
    
    /**
     * Registra um novo atendimento (evolução) para uma internação.
     * POST /api/internacoes/{internacao}/atendimentos
     */
    public function storeForInternacao(Request $request, Internacao $internacao): JsonResponse
    {
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
            'exames_laboratoriais' => 'nullable|array',
            'medicamentos_administrados' => 'nullable|array',
            'procedimentos_realizados' => 'nullable|array',
            'ocorrencias_clinicas' => 'nullable|array',
        ]);

        try {
            $usuario = Auth::user();
            if (!$usuario) {
                return response()->json([
                    'message' => 'Usuário não autenticado.',
                    'error' => 'Auth::user() retornou null'
                ], 401);
            }
            
            // Calcular categoria de risco preservando Aborto se já definido
            $categoriaAtual = $internacao->categoria_risco_id;
            $novaCategoria = $this->calcularCategoriaRisco($validatedData, $categoriaAtual);
            
            $atendimento = $internacao->atendimentos()->create([
                'usuario_id' => $usuario->id,
                'data_hora' => now(),
                'categoria_risco_id' => $novaCategoria,
                'pressao_sistolica' => $validatedData['pressao_sistolica'] ?? null,
                'pressao_diastolica' => $validatedData['pressao_diastolica'] ?? null,
                'frequencia_cardiaca' => $validatedData['frequencia_cardiaca'] ?? null,
                'temperatura' => $validatedData['temperatura'] ?? null,
                'frequencia_respiratoria' => $validatedData['frequencia_respiratoria'] ?? null,
                'evolucao_maternidade' => $validatedData['evolucao_maternidade'] ?? null,
                'avaliacao_fetal' => $validatedData['avaliacao_fetal'] ?? null,
                'bcf' => $validatedData['bcf'] ?? null,
                'movimentos_fetais_presentes' => $validatedData['movimentos_fetais_presentes'] ?? false,
                'altura_uterina' => $validatedData['altura_uterina'] ?? null,
            ]);
            
            // Processar apenas se houver dados
            if (!empty($validatedData['exames_laboratoriais']) && is_array($validatedData['exames_laboratoriais'])) {
                foreach ($validatedData['exames_laboratoriais'] as $exame) {
                    if (!empty($exame['nome'])) {
                        $atendimento->examesLaboratoriais()->create([
                            'nome' => $exame['nome'],
                            'resultado' => $exame['resultado'] ?? '',
                            'data_exame' => $exame['data_exame'] ?? now()->format('Y-m-d'),
                        ]);
                    }
                }
            }
            
            if (!empty($validatedData['medicamentos_administrados']) && is_array($validatedData['medicamentos_administrados'])) {
                foreach ($validatedData['medicamentos_administrados'] as $medicamento) {
                    if (!empty($medicamento['nome_medicacao'])) {
                        $atendimento->medicamentosAdministrados()->create([
                            'nome_medicacao' => $medicamento['nome_medicacao'],
                            'dosagem' => $medicamento['dosagem'] ?? '',
                            'frequencia' => $medicamento['frequencia'] ?? '',
                        ]);
                    }
                }
            }
            
            if (!empty($validatedData['procedimentos_realizados']) && is_array($validatedData['procedimentos_realizados'])) {
                foreach ($validatedData['procedimentos_realizados'] as $procedimento) {
                    if (!empty($procedimento['nome_procedimento'])) {
                        $atendimento->procedimentosRealizados()->create([
                            'nome_procedimento' => $procedimento['nome_procedimento'],
                            'observacoes' => $procedimento['descricao'] ?? '',
                        ]);
                    }
                }
            }
            
            if (!empty($validatedData['ocorrencias_clinicas']) && is_array($validatedData['ocorrencias_clinicas'])) {
                foreach ($validatedData['ocorrencias_clinicas'] as $ocorrencia) {
                    if (!empty($ocorrencia['descricao'])) {
                        $atendimento->ocorrenciasClinicas()->create([
                            'descricao' => $ocorrencia['descricao'],
                            'data_ocorrencia' => $ocorrencia['data_ocorrencia'] ?? now(),
                        ]);
                    }
                }
            }
            
            // Registrar auditoria para criação de atendimento
            $this->registrarAuditoria($internacao->paciente_id, 'criacao', 'atendimento');
            
            // Recarregar o atendimento com os relacionamentos
            $atendimento->load([
                'examesLaboratoriais', 
                'medicamentosAdministrados', 
                'procedimentosRealizados',
                'ocorrenciasClinicas',
                'usuario' => function($query) {
                    $query->withoutGlobalScopes();
                }
            ]);
            
            return response()->json([
                'message' => 'Atendimento registrado com sucesso!',
                'data' => $atendimento
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao registrar atendimento.', 
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
            'usuario', 
            'categoriaRisco', 
            'examesLaboratoriais', 
            'medicamentosAdministrados',
            'procedimentosRealizados',
            'ocorrenciasClinicas'
        );
        
        return response()->json($atendimento);
    }
    
    /**
     * Atualiza atendimento
     * PUT /api/atendimentos/{atendimento}
     */
    public function update(Request $request, Atendimento $atendimento): JsonResponse
    {
        $validatedData = $request->validate([
            'categoria_risco_id' => 'sometimes|exists:categoria_riscos,id',
            'pressao_sistolica' => 'nullable|integer',
            'pressao_diastolica' => 'nullable|integer',
            'frequencia_cardiaca' => 'nullable|integer',
            'temperatura' => 'nullable|numeric',
            'evolucao_maternidade' => 'nullable|string',
            'avaliacao_fetal' => 'nullable|string'
        ]);
        
        $atendimento->update($validatedData);
        
        return response()->json($atendimento->load(['usuario', 'categoriaRisco']));
    }
    
    /**
     * Remove atendimento
     * DELETE /api/atendimentos/{atendimento}
     */
    public function destroy(Atendimento $atendimento): JsonResponse
    {
        $atendimento->delete();
        
        return response()->json(['message' => 'Atendimento removido com sucesso']);
    }

    // ========== EXAMES LABORATORIAIS ==========
    
    /**
     * Lista exames de um atendimento
     * GET /api/atendimentos/{atendimento}/exames
     */
    public function getExames(Atendimento $atendimento): JsonResponse
    {
        return response()->json($atendimento->examesLaboratoriais);
    }

    /**
     * Adiciona exame a um atendimento
     * POST /api/atendimentos/{atendimento}/exames
     */
    public function storeExame(Request $request, Atendimento $atendimento): JsonResponse
    {
        $validatedData = $request->validate([
            'nome' => 'required|string',
            'resultado' => 'required|string',
            'data_exame' => 'required|date',
        ]);

        $exame = $atendimento->examesLaboratoriais()->create($validatedData);
        
        return response()->json($exame, 201);
    }

    /**
     * Atualiza exame de um atendimento
     * PUT /api/atendimentos/{atendimento}/exames/{exame}
     */
    public function updateExame(Request $request, Atendimento $atendimento, $exameId): JsonResponse
    {
        $exame = $atendimento->examesLaboratoriais()->findOrFail($exameId);
        
        $validatedData = $request->validate([
            'nome' => 'sometimes|string',
            'resultado' => 'sometimes|string',
            'data_exame' => 'sometimes|date',
        ]);

        $exame->update($validatedData);
        
        return response()->json($exame);
    }

    /**
     * Remove exame de um atendimento
     * DELETE /api/atendimentos/{atendimento}/exames/{exame}
     */
    public function destroyExame(Atendimento $atendimento, $exameId): JsonResponse
    {
        $exame = $atendimento->examesLaboratoriais()->findOrFail($exameId);
        $exame->delete();
        
        return response()->json(['message' => 'Exame removido com sucesso']);
    }

    // ========== MEDICAMENTOS ADMINISTRADOS ==========
    
    /**
     * Lista medicamentos de um atendimento
     * GET /api/atendimentos/{atendimento}/medicamentos
     */
    public function getMedicamentos(Atendimento $atendimento): JsonResponse
    {
        return response()->json($atendimento->medicamentosAdministrados);
    }

    /**
     * Adiciona medicamento a um atendimento
     * POST /api/atendimentos/{atendimento}/medicamentos
     */
    public function storeMedicamento(Request $request, Atendimento $atendimento): JsonResponse
    {
        $validatedData = $request->validate([
            'nome_medicacao' => 'required|string',
            'dosagem' => 'required|string',
            'frequencia' => 'required|string',
        ]);

        $medicamento = $atendimento->medicamentosAdministrados()->create($validatedData);
        
        return response()->json($medicamento, 201);
    }

    /**
     * Atualiza medicamento de um atendimento
     * PUT /api/atendimentos/{atendimento}/medicamentos/{medicamento}
     */
    public function updateMedicamento(Request $request, Atendimento $atendimento, $medicamentoId): JsonResponse
    {
        $medicamento = $atendimento->medicamentosAdministrados()->findOrFail($medicamentoId);
        
        $validatedData = $request->validate([
            'nome_medicacao' => 'sometimes|string',
            'dosagem' => 'sometimes|string',
            'frequencia' => 'sometimes|string',
        ]);

        $medicamento->update($validatedData);
        
        return response()->json($medicamento);
    }

    /**
     * Remove medicamento de um atendimento
     * DELETE /api/atendimentos/{atendimento}/medicamentos/{medicamento}
     */
    public function destroyMedicamento(Atendimento $atendimento, $medicamentoId): JsonResponse
    {
        $medicamento = $atendimento->medicamentosAdministrados()->findOrFail($medicamentoId);
        $medicamento->delete();
        
        return response()->json(['message' => 'Medicamento removido com sucesso']);
    }

    // ========== PROCEDIMENTOS REALIZADOS ==========
    
    /**
     * Lista procedimentos de um atendimento
     * GET /api/atendimentos/{atendimento}/procedimentos
     */
    public function getProcedimentos(Atendimento $atendimento): JsonResponse
    {
        return response()->json($atendimento->procedimentosRealizados);
    }

    /**
     * Adiciona procedimento a um atendimento
     * POST /api/atendimentos/{atendimento}/procedimentos
     */
    public function storeProcedimento(Request $request, Atendimento $atendimento): JsonResponse
    {
        $validatedData = $request->validate([
            'nome_procedimento' => 'required|string',
            'descricao' => 'nullable|string',
            'data_procedimento' => 'required|date',
        ]);

        $procedimento = $atendimento->procedimentosRealizados()->create($validatedData);
        
        return response()->json($procedimento, 201);
    }

    /**
     * Atualiza procedimento de um atendimento
     * PUT /api/atendimentos/{atendimento}/procedimentos/{procedimento}
     */
    public function updateProcedimento(Request $request, Atendimento $atendimento, $procedimentoId): JsonResponse
    {
        $procedimento = $atendimento->procedimentosRealizados()->findOrFail($procedimentoId);
        
        $validatedData = $request->validate([
            'nome_procedimento' => 'sometimes|string',
            'descricao' => 'sometimes|string',
            'data_procedimento' => 'sometimes|date',
        ]);

        $procedimento->update($validatedData);
        
        return response()->json($procedimento);
    }

    /**
     * Remove procedimento de um atendimento
     * DELETE /api/atendimentos/{atendimento}/procedimentos/{procedimento}
     */
    public function destroyProcedimento(Atendimento $atendimento, $procedimentoId): JsonResponse
    {
        $procedimento = $atendimento->procedimentosRealizados()->findOrFail($procedimentoId);
        $procedimento->delete();
        
        return response()->json(['message' => 'Procedimento removido com sucesso']);
    }

    // ========== OCORRÊNCIAS CLÍNICAS ==========
    
    /**
     * Lista ocorrências de um atendimento
     * GET /api/atendimentos/{atendimento}/ocorrencias
     */
    public function getOcorrencias(Atendimento $atendimento): JsonResponse
    {
        return response()->json($atendimento->ocorrenciasClinicas()->orderBy('data_ocorrencia', 'desc')->get());
    }

    /**
     * Adiciona ocorrência a um atendimento
     * POST /api/atendimentos/{atendimento}/ocorrencias
     */
    public function storeOcorrencia(Request $request, Atendimento $atendimento): JsonResponse
    {
        $validatedData = $request->validate([
            'descricao' => 'required|string|max:1000',
            'data_ocorrencia' => 'required|date',
        ]);

        $ocorrencia = $atendimento->ocorrenciasClinicas()->create($validatedData);
        
        return response()->json($ocorrencia, 201);
    }

    /**
     * Atualiza ocorrência de um atendimento
     * PUT /api/atendimentos/{atendimento}/ocorrencias/{ocorrencia}
     */
    public function updateOcorrencia(Request $request, Atendimento $atendimento, $ocorrenciaId): JsonResponse
    {
        $ocorrencia = $atendimento->ocorrenciasClinicas()->findOrFail($ocorrenciaId);
        
        $validatedData = $request->validate([
            'descricao' => 'sometimes|string|max:1000',
            'data_ocorrencia' => 'sometimes|date',
        ]);

        $ocorrencia->update($validatedData);
        
        return response()->json($ocorrencia);
    }

    /**
     * Remove ocorrência de um atendimento
     * DELETE /api/atendimentos/{atendimento}/ocorrencias/{ocorrencia}
     */
    public function destroyOcorrencia(Atendimento $atendimento, $ocorrenciaId): JsonResponse
    {
        $ocorrencia = $atendimento->ocorrenciasClinicas()->findOrFail($ocorrenciaId);
        $ocorrencia->delete();
        
        return response()->json(['message' => 'Ocorrência removida com sucesso']);
    }
}