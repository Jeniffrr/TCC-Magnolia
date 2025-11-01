<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use App\Models\Internacao;
use App\Models\Atendimento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use App\Http\Traits\CalculaRiscoTrait; // <-- Importa a lógica de risco

class PacienteController extends Controller
{
    use CalculaRiscoTrait; // <-- Usa a lógica de risco neste controller

    /**
     * Display a listing of the resource.
     * GET /api/pacientes
     */
    public function index(): JsonResponse
    {
        $pacientes = Paciente::with('internacoesAtivas.leito')->latest()->paginate(15);
        return response()->json($pacientes);
    }

    /**
     * Armazena uma nova paciente e toda a sua admissão (internação, primeiro atendimento e todos os dados satélite).
     * POST /api/pacientes
     */
    public function store(Request $request): JsonResponse
    {
        // 1. VALIDAÇÃO DOS DADOS BÁSICOS (apenas os campos enviados pelo frontend)
        $validatedData = $request->validate([
            // Paciente
            'nome_completo' => 'required|string|max:255',
            'cpf' => 'required|string|unique:pacientes,cpf|size:11',
            'nome_mae' => 'required|string|max:255',
            'data_nascimento' => 'required|date',
            'telefone' => 'nullable|string|max:20',
            'rua' => 'nullable|string|max:255',
            'numero' => 'nullable|string|max:50',
            'bairro' => 'nullable|string|max:255',
            'cidade' => 'nullable|string|max:255',
            'estado' => 'nullable|string|max:2',
            'cep' => 'nullable|string|max:9',
            'alergias' => 'nullable|string',
            'medicamentos_continuos' => 'nullable|string',
            
            // Internação
            'leito_id' => 'required|exists:leitos,id',
            'motivo_internacao' => 'required|string',

            // Atendimento - Sinais Vitais
            'pressao_sistolica' => 'nullable|integer',
            'pressao_diastolica' => 'nullable|integer',
            'frequencia_cardiaca' => 'nullable|integer',
            'temperatura' => 'nullable|numeric',
            'frequencia_respiratoria' => 'nullable|integer',
            
            // Atendimento - Evolução
            'evolucao_maternidade' => 'nullable|string',
            'avaliacao_fetal' => 'nullable|string',
            'bcf' => 'nullable|integer',
            'movimentos_fetais_presentes' => 'nullable|boolean',
            'altura_uterina' => 'nullable|integer',

            // Campos LGPD
            'consentimento_lgpd_aceito' => 'required|boolean',
            'data_consentimento_lgpd' => 'nullable|date',

            // Condições patológicas
            'condicoes_patologicas' => 'nullable|array',
            'condicoes_patologicas.*' => 'integer|exists:condicao_patologicas,id',
        ]);

        // 2. CALCULA O RISCO AUTOMATICAMENTE
        $categoriaRiscoId = $this->calcularCategoriaRisco($validatedData);

        // 3. EXECUTA A CRIAÇÃO DENTRO DE UMA TRANSAÇÃO
        try {
            $result = DB::transaction(function () use ($validatedData, $categoriaRiscoId, $request) {
                
                // 3.1. Cria a Paciente
                $paciente = Paciente::create([
                    'nome_completo' => $validatedData['nome_completo'],
                    'cpf' => $validatedData['cpf'],
                    'nome_mae' => $validatedData['nome_mae'],
                    'data_nascimento' => $validatedData['data_nascimento'],
                    'telefone' => $validatedData['telefone'] ?? null,
                    'rua' => $validatedData['rua'] ?? null,
                    'numero' => $validatedData['numero'] ?? null,
                    'bairro' => $validatedData['bairro'] ?? null,
                    'cidade' => $validatedData['cidade'] ?? null,
                    'estado' => $validatedData['estado'] ?? null,
                    'cep' => $validatedData['cep'] ?? null,
                    'alergias' => $validatedData['alergias'] ?? null,
                    'medicamentos_continuos' => $validatedData['medicamentos_continuos'] ?? null,
                    'consentimento_lgpd_aceito' => $validatedData['consentimento_lgpd_aceito'],
                    'data_consentimento_lgpd' => $validatedData['consentimento_lgpd_aceito'] ? now() : null,
                    'usuario_id' => $request->user()->id, 
                    'hospital_id' => $request->user()->hospital_id, 
                ]);

                // 3.2. Liga os dados satélite da Paciente
                if (!empty($validatedData['condicoes_patologicas'])) {
                    $paciente->condicoesPatologicas()->sync($validatedData['condicoes_patologicas']);
                }

                // 3.3. Cria a Internação
                $internacao = $paciente->internacoes()->create([
                    'leito_id' => $validatedData['leito_id'],
                    'motivo_internacao' => $validatedData['motivo_internacao'],
                    'data_entrada' => now(),
                    'status' => 'ativa',
                ]);

                // 3.4. Cria o Primeiro Atendimento
                $atendimento = $internacao->atendimentos()->create([
                    'usuario_id' => $request->user()->id,
                    'data_hora' => now(),
                    'categoria_risco_id' => $categoriaRiscoId, // <-- Risco calculado!
                    'frequencia_cardiaca' => $validatedData['frequencia_cardiaca'] ,
                    'pressao_sistolica' => $validatedData['pressao_sistolica'],
                    'pressao_diastolica' => $validatedData['pressao_diastolica'],
                    'temperatura' => $validatedData['temperatura'] ,
                    'frequencia_respiratoria' => $validatedData['frequencia_respiratoria'] ?? null,
                    'evolucao_maternidade' => $validatedData['evolucao_maternidade'] ?? null,
                    'avaliacao_fetal' => $validatedData['avaliacao_fetal'] ,
                    'bcf' => $validatedData['bcf'] ?? null,
                    'movimentos_fetais_presentes' => $validatedData['movimentos_fetais_presentes'] ,
                    'altura_uterina' => $validatedData['altura_uterina'] ?? null,
                ]);

                // 3.5. Liga os dados satélite do Atendimento (removido por enquanto)

                // 4. Retorna os dados criados
                return [
                    'paciente' => $paciente->load('condicoesPatologicas'),
                    'internacao' => $internacao,
                    'atendimento' => $atendimento
                ];
            });

            // 5. Retorna a resposta de sucesso
            return response()->json([
                'message' => 'Admissão da paciente realizada com sucesso!',
                'data' => $result
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Captura de erro de validação (embora o Laravel já faça isso)
            return response()->json(['message' => 'Dados inválidos.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Captura de erro de banco de dados ou outro
            return response()->json([
                'message' => 'Ocorreu um erro no servidor ao processar a admissão.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * GET /api/pacientes/{paciente}
     */
    public function show(Paciente $paciente): JsonResponse
    {
        $paciente->load('internacoes.atendimentos', 'condicoesPatologicas', 'gestacoesAnteriores');
        return response()->json($paciente);
    }

    /**
     * Update the specified resource in storage.
     * PUT /api/pacientes/{paciente}
     */
    public function update(Request $request, Paciente $paciente): JsonResponse
    {
        // Validação para campos que podem ser editados (dados demográficos)
        $validatedData = $request->validate([
            'nome_completo' => 'sometimes|required|string|max:255',
            'nome_mae' => 'sometimes|required|string|max:255',
            'telefone' => 'nullable|string|max:20',
            'rua' => 'nullable|string|max:255',
            'numero' => 'nullable|string|max:50',
            'bairro' => 'nullable|string|max:255',
            'cidade' => 'nullable|string|max:255',
            'estado' => 'nullable|string|max:2',
            'cep' => 'nullable|string|max:9',
            'alergias' => 'nullable|text',
            'medicamentos_continuos' => 'nullable|text',
            'consentimento_lgpd_aceito' => 'sometimes|boolean',
            'data_consentimento_lgpd' => 'nullable|date',
        ]);

        $paciente->update($validatedData);

        return response()->json([
            'message' => 'Dados da paciente atualizados com sucesso!',
            'data' => $paciente
        ]);
    }
}