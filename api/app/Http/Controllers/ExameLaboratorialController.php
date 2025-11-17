<?php

namespace App\Http\Controllers;

use App\Models\ExameLaboratorial;
use App\Models\Atendimento;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExameLaboratorialController extends Controller
{
    /**
     * Lista exames laboratoriais
     * GET /api/exames-laboratoriais
     */
    public function index(Request $request): JsonResponse
    {
        $query = ExameLaboratorial::with('atendimento');
        
        if ($request->has('atendimento_id')) {
            $query->where('atendimento_id', $request->atendimento_id);
        }
        
        $exames = $query->get();
        return response()->json($exames);
    }

    /**
     * Cria novo exame laboratorial
     * POST /api/exames-laboratoriais
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'atendimento_id' => 'required|exists:atendimentos,id',
            'nome' => 'required|string',
            'resultado' => 'required|string',
            'data_exame' => 'required|date',
        ]);

        $exame = ExameLaboratorial::create($validatedData);
        
        return response()->json($exame, 201);
    }

    /**
     * Exibe exame específico
     * GET /api/exames-laboratoriais/{exame}
     */
    public function show(ExameLaboratorial $exame): JsonResponse
    {
        return response()->json($exame->load('atendimento'));
    }

    /**
     * Atualiza exame
     * PUT /api/exames-laboratoriais/{exame}
     */
    public function update(Request $request, ExameLaboratorial $exame): JsonResponse
    {
        $validatedData = $request->validate([
            'nome' => 'sometimes|string',
            'resultado' => 'sometimes|string',
            'data_exame' => 'sometimes|date',
        ]);

        $exame->update($validatedData);
        
        return response()->json($exame);
    }

    /**
     * Remove exame
     * DELETE /api/exames-laboratoriais/{exame}
     */
    public function destroy(ExameLaboratorial $exame): JsonResponse
    {
        $exame->delete();
        
        return response()->json(['message' => 'Exame removido com sucesso']);
    }
}