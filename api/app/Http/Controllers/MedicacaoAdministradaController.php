<?php

namespace App\Http\Controllers;

use App\Models\MedicacaoAdministrada;
use App\Models\Atendimento;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MedicacaoAdministradaController extends Controller
{
    /**
     * Lista medicamentos administrados
     * GET /api/medicamentos-administrados
     */
    public function index(Request $request): JsonResponse
    {
        $query = MedicacaoAdministrada::with('atendimento');
        
        if ($request->has('atendimento_id')) {
            $query->where('atendimento_id', $request->atendimento_id);
        }
        
        $medicamentos = $query->get();
        return response()->json($medicamentos);
    }

    /**
     * Cria novo medicamento administrado
     * POST /api/medicamentos-administrados
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'atendimento_id' => 'required|exists:atendimentos,id',
            'nome_medicacao' => 'required|string',
            'dosagem' => 'required|string',
            'frequencia' => 'required|string',
        ]);

        $medicamento = MedicacaoAdministrada::create($validatedData);
        
        return response()->json($medicamento, 201);
    }

    /**
     * Exibe medicamento específico
     * GET /api/medicamentos-administrados/{medicamento}
     */
    public function show(MedicacaoAdministrada $medicamento): JsonResponse
    {
        return response()->json($medicamento->load('atendimento'));
    }

    /**
     * Atualiza medicamento
     * PUT /api/medicamentos-administrados/{medicamento}
     */
    public function update(Request $request, MedicacaoAdministrada $medicamento): JsonResponse
    {
        $validatedData = $request->validate([
            'nome_medicacao' => 'sometimes|string',
            'dosagem' => 'sometimes|string',
            'frequencia' => 'sometimes|string',
        ]);

        $medicamento->update($validatedData);
        
        return response()->json($medicamento);
    }

    /**
     * Remove medicamento
     * DELETE /api/medicamentos-administrados/{medicamento}
     */
    public function destroy(MedicacaoAdministrada $medicamento): JsonResponse
    {
        $medicamento->delete();
        
        return response()->json(['message' => 'Medicamento removido com sucesso']);
    }
}