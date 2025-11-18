<?php

namespace App\Http\Controllers;

use App\Models\OcorrenciaClinica;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OcorrenciaClinicaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = OcorrenciaClinica::with('atendimento');
        
        if ($request->has('atendimento_id')) {
            $query->where('atendimento_id', $request->atendimento_id);
        }
        
        $ocorrencias = $query->orderBy('data_ocorrencia', 'desc')->get();
        
        return response()->json($ocorrencias);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'atendimento_id' => 'required|exists:atendimentos,id',
            'descricao' => 'required|string|max:1000',
            'data_ocorrencia' => 'required|date'
        ]);

        $ocorrencia = OcorrenciaClinica::create($validated);
        
        return response()->json($ocorrencia->load('atendimento'), 201);
    }

    public function show(OcorrenciaClinica $ocorrencia): JsonResponse
    {
        return response()->json($ocorrencia->load('atendimento'));
    }

    public function update(Request $request, OcorrenciaClinica $ocorrencia): JsonResponse
    {
        $validated = $request->validate([
            'descricao' => 'sometimes|string|max:1000',
            'data_ocorrencia' => 'sometimes|date'
        ]);

        $ocorrencia->update($validated);
        
        return response()->json($ocorrencia->load('atendimento'));
    }

    public function destroy(OcorrenciaClinica $ocorrencia): JsonResponse
    {
        $ocorrencia->delete();
        
        return response()->json(['message' => 'Ocorrência removida com sucesso']);
    }

    public function byAtendimento($atendimentoId): JsonResponse
    {
        $ocorrencias = OcorrenciaClinica::where('atendimento_id', $atendimentoId)
            ->orderBy('data_ocorrencia', 'desc')
            ->get();
            
        return response()->json($ocorrencias);
    }
}