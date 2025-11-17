<?php

namespace App\Http\Controllers;

use App\Models\ProcedimentoRealizado;
use App\Models\Atendimento;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProcedimentoRealizadoController extends Controller
{
    /**
     * Lista procedimentos realizados
     * GET /api/procedimentos-realizados
     */
    public function index(Request $request): JsonResponse
    {
        $query = ProcedimentoRealizado::with('atendimento');
        
        if ($request->has('atendimento_id')) {
            $query->where('atendimento_id', $request->atendimento_id);
        }
        
        $procedimentos = $query->get();
        return response()->json($procedimentos);
    }

    /**
     * Cria novo procedimento realizado
     * POST /api/procedimentos-realizados
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'atendimento_id' => 'required|exists:atendimentos,id',
            'nome_procedimento' => 'required|string',
            'descricao' => 'nullable|string',
            'data_procedimento' => 'required|date',
        ]);

        $procedimento = ProcedimentoRealizado::create($validatedData);
        
        return response()->json($procedimento, 201);
    }

    /**
     * Exibe procedimento específico
     * GET /api/procedimentos-realizados/{procedimento}
     */
    public function show(ProcedimentoRealizado $procedimento): JsonResponse
    {
        return response()->json($procedimento->load('atendimento'));
    }

    /**
     * Atualiza procedimento
     * PUT /api/procedimentos-realizados/{procedimento}
     */
    public function update(Request $request, ProcedimentoRealizado $procedimento): JsonResponse
    {
        $validatedData = $request->validate([
            'nome_procedimento' => 'sometimes|string',
            'descricao' => 'sometimes|string',
            'data_procedimento' => 'sometimes|date',
        ]);

        $procedimento->update($validatedData);
        
        return response()->json($procedimento);
    }

    /**
     * Remove procedimento
     * DELETE /api/procedimentos-realizados/{procedimento}
     */
    public function destroy(ProcedimentoRealizado $procedimento): JsonResponse
    {
        $procedimento->delete();
        
        return response()->json(['message' => 'Procedimento removido com sucesso']);
    }
}