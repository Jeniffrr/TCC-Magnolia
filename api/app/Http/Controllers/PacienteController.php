<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use App\Models\Internacao;
use App\Models\Atendimento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use App\Http\Traits\CalculaRiscoTrait;
use App\Http\Traits\AuditoriaTrait;

class PacienteController extends Controller
{
    use CalculaRiscoTrait;
    use AuditoriaTrait;

    public function index(): JsonResponse
    {
        $pacientes = Paciente::whereHas('internacoes', function($query) {
            $query->where('status', 'ativa');
        })->with('internacoesAtivas.leito')->latest()->paginate(15);
        return response()->json($pacientes);
    }

    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'nome_completo' => 'required|string|max:255',
            'cpf' => 'required|string|unique:pacientes,cpf|size:11',
            'nome_mae' => 'required|string|max:255',
            'data_nascimento' => 'required|date',
            'telefone' => 'required|string|max:20',
            'rua' => 'required|string|max:255',
            'numero' => 'required|string|max:50',
            'bairro' => 'required|string|max:255',
            'cidade' => 'required|string|max:255',
            'estado' => 'required|string|max:2',
            'cep' => 'nullable|string|max:9',
            'alergias' => 'nullable|string',
            'medicamentos_continuos' => 'nullable|string',
            'leito_id' => 'required|exists:leitos,id',
            'motivo_internacao' => 'required|string',
            'pressao_sistolica' => 'required|integer',
            'pressao_diastolica' => 'required|integer',
            'frequencia_cardiaca' => 'required|integer',
            'temperatura' => 'required|numeric',
            'frequencia_respiratoria' => 'required|integer',
            'evolucao_maternidade' => 'nullable|string',
            'avaliacao_fetal' => 'required|string',
            'bcf' => 'nullable|integer',
            'movimentos_fetais_presentes' => 'nullable|boolean',
            'altura_uterina' => 'nullable|integer',
            'consentimento_lgpd_aceito' => 'required|boolean',
            'data_consentimento_lgpd' => 'nullable|date',
            'condicoes_patologicas' => 'nullable|array',
            'condicoes_patologicas.*' => 'integer|exists:condicao_patologicas,id',
            'gestacoes_anteriores' => 'nullable|array',
            'gestacoes_anteriores.*.ano_parto' => 'nullable|integer',
            'gestacoes_anteriores.*.tipo_parto' => 'nullable|string',
            'gestacoes_anteriores.*.observacoes' => 'nullable|string'
        ]);

        $categoriaRiscoId = $this->calcularCategoriaRisco($validatedData);

        try {
            $result = DB::transaction(function () use ($validatedData, $categoriaRiscoId, $request) {
                $paciente = Paciente::create([
                    'nome_completo' => $validatedData['nome_completo'],
                    'cpf' => $validatedData['cpf'],
                    'nome_mae' => $validatedData['nome_mae'],
                    'data_nascimento' => $validatedData['data_nascimento'],
                    'telefone' => $validatedData['telefone'],
                    'rua' => $validatedData['rua'],
                    'numero' => $validatedData['numero'],
                    'bairro' => $validatedData['bairro'],
                    'cidade' => $validatedData['cidade'],
                    'estado' => $validatedData['estado'],
                    'cep' => $validatedData['cep'] ?? null,
                    'alergias' => $validatedData['alergias'] ?? null,
                    'medicamentos_continuos' => $validatedData['medicamentos_continuos'] ?? null,
                    'consentimento_lgpd_aceito' => $validatedData['consentimento_lgpd_aceito'],
                    'data_consentimento_lgpd' => $validatedData['consentimento_lgpd_aceito'] ? now() : null,
                    'usuario_id' => $request->user()->id,
                    'hospital_id' => $request->user()->hospital_id,
                ]);

                if (!empty($validatedData['condicoes_patologicas'])) {
                    $paciente->condicoesPatologicas()->sync($validatedData['condicoes_patologicas']);
                }

                if (!empty($validatedData['gestacoes_anteriores'])) {
                    foreach ($validatedData['gestacoes_anteriores'] as $gestacao) {
                        $paciente->gestacoesAnteriores()->create([
                            'ano_parto' => $gestacao['ano_parto'],
                            'tipo_parto' => $gestacao['tipo_parto'],
                            'observacoes' => $gestacao['observacoes'] ?? null,
                        ]);
                    }
                }

                $internacao = $paciente->internacoes()->create([
                    'usuario_id' => $request->user()->id,
                    'leito_id' => $validatedData['leito_id'],
                    'motivo_internacao' => $validatedData['motivo_internacao'],
                    'data_entrada' => now(),
                    'status' => 'ativa',
                ]);

                $atendimento = $internacao->atendimentos()->create([
                    'usuario_id' => $request->user()->id,
                    'data_hora' => now(),
                    'categoria_risco_id' => $categoriaRiscoId,
                    'frequencia_cardiaca' => $validatedData['frequencia_cardiaca'],
                    'pressao_sistolica' => $validatedData['pressao_sistolica'],
                    'pressao_diastolica' => $validatedData['pressao_diastolica'],
                    'temperatura' => $validatedData['temperatura'],
                    'frequencia_respiratoria' => $validatedData['frequencia_respiratoria'],
                    'evolucao_maternidade' => $validatedData['evolucao_maternidade'] ?? null,
                    'avaliacao_fetal' => $validatedData['avaliacao_fetal'],
                    'bcf' => $validatedData['bcf'] ?? null,
                    'movimentos_fetais_presentes' => $validatedData['movimentos_fetais_presentes'],
                    'altura_uterina' => $validatedData['altura_uterina'] ?? null,
                ]);

                return [
                    'paciente' => $paciente->load('condicoesPatologicas'),
                    'internacao' => $internacao,
                    'atendimento' => $atendimento
                ];
            });

            return response()->json([
                'message' => 'Admissão da paciente realizada com sucesso!',
                'data' => $result
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Dados inválidos.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocorreu um erro no servidor ao processar a admissão.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Paciente $paciente): JsonResponse
    {
        try {
            $this->registrarAuditoria($paciente->id, 'visualizacao', 'dados_pessoais');
            $paciente->load('condicoesPatologicas', 'gestacoesAnteriores');
            return response()->json($paciente);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Erro ao buscar paciente: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao buscar dados da paciente.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Paciente $paciente): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'nome_completo' => 'sometimes|required|string|max:255',
                'nome_mae' => 'sometimes|required|string|max:255',
                'telefone' => 'sometimes|string|max:20',
                'rua' => 'sometimes|string|max:255',
                'numero' => 'sometimes|string|max:50',
                'bairro' => 'sometimes|string|max:255',
                'cidade' => 'sometimes|string|max:255',
                'estado' => 'sometimes|string|max:2',
                'cep' => 'nullable|string|max:9',
                'alergias' => 'nullable|string',
                'medicamentos_continuos' => 'nullable|string',
                'condicoes_patologicas' => 'nullable|array',
                'condicoes_patologicas.*' => 'integer|exists:condicao_patologicas,id',
                'gestacoes_anteriores' => 'nullable|array',
                'gestacoes_anteriores.*.ano_parto' => 'nullable|integer',
                'gestacoes_anteriores.*.tipo_parto' => 'nullable|string',
                'gestacoes_anteriores.*.observacoes' => 'nullable|string'
            ]);

            DB::transaction(function () use ($validatedData, $paciente) {
                $this->registrarAuditoria($paciente->id, 'edicao', 'dados_pessoais');
                $paciente->update(Arr::except($validatedData, ['condicoes_patologicas', 'gestacoes_anteriores']));

                if (isset($validatedData['condicoes_patologicas'])) {
                    $paciente->condicoesPatologicas()->sync($validatedData['condicoes_patologicas']);
                }

                if (isset($validatedData['gestacoes_anteriores'])) {
                    $paciente->gestacoesAnteriores()->delete();
                    foreach ($validatedData['gestacoes_anteriores'] as $gestacao) {
                        if (!empty($gestacao['ano_parto']) || !empty($gestacao['tipo_parto'])) {
                            $paciente->gestacoesAnteriores()->create([
                                'ano_parto' => $gestacao['ano_parto'] ?? null,
                                'tipo_parto' => $gestacao['tipo_parto'] ?? null,
                                'observacoes' => $gestacao['observacoes'] ?? null,
                            ]);
                        }
                    }
                }
            });

            return response()->json([
                'message' => 'Dados da paciente atualizados com sucesso!',
                'data' => $paciente->fresh(['condicoesPatologicas', 'gestacoesAnteriores'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao atualizar dados da paciente.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
