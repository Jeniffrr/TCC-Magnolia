<?php

namespace App\Http\Controllers;

use App\Models\Leito;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LeitoController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'numero' => 'required|string|max:10',
            'tipo' => 'required|string|max:50',
            'capacidade_maxima' => 'required|integer|min:1',
        ], [
            'numero.required' => 'O campo número é obrigatório.',
            'tipo.required' => 'O campo tipo é obrigatório.',
            'capacidade_maxima.required' => 'O campo capacidade máxima é obrigatório.',
            'capacidade_maxima.integer' => 'O campo capacidade máxima deve ser um número inteiro.',
            'capacidade_maxima.min' => 'O campo capacidade máxima deve ser no mínimo 1.',
        ]);

        $leito = Leito::create([
            'numero' => $request->numero,
            'tipo' => $request->tipo,
            'capacidade_maxima' => $request->capacidade_maxima,
            'hospital_id' => 1,
        ]);

        return response()->json([
            'message' => 'Leito cadastrado com sucesso!',
            'leito' => $leito
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $leitos = Leito::select('id', 'numero', 'tipo', 'capacidade_maxima', 'created_at')
            ->orderBy('numero', 'asc')
            ->paginate(10);

        return response()->json($leitos, 200);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $leito = Leito::find($id);

        if (!$leito) {
            return response()->json(['message' => 'Leito não encontrado.'], 404);
        }

        return response()->json($leito, 200);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $leito = Leito::find($id);

        if (!$leito) {
            return response()->json(['message' => 'Leito não encontrado.'], 404);
        }

        $request->validate([
            'numero' => 'sometimes|string|max:10',
            'tipo' => 'sometimes|string|max:50',
            'capacidade_maxima' => 'sometimes|integer|min:1',
        ], [
            'numero.required' => 'O campo número é obrigatório.',
            'tipo.required' => 'O campo tipo é obrigatório.',
            'capacidade_maxima.integer' => 'O campo capacidade máxima deve ser um número inteiro.',
            'capacidade_maxima.min' => 'O campo capacidade máxima deve ser no mínimo 1.',
        ]);

        $data = $request->only(['numero', 'tipo', 'capacidade_maxima']);
        $leito->update($data);

        return response()->json([
            'message' => 'Leito atualizado com sucesso!',
            'leito' => $leito->fresh()
        ], 200);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $leito = Leito::find($id);

        if (!$leito) {
            return response()->json(['message' => 'Leito não encontrado.'], 404);
        }

        $leito->delete();

        return response()->json([
            'message' => "Leito '{$leito->numero}' removido com sucesso."
        ], 200);
    }
}
