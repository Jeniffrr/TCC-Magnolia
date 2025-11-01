<?php

namespace App\Http\Controllers;

use App\Models\CategoriaRisco; // Importe o seu model CategoriaRisco
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoriaRiscoController extends Controller
{
    /**
     * Display a listing of the resource.
     * (Exibe uma listagem do recurso)
     *
     * GET /api/categoria-riscos
     */
    public function index(): JsonResponse
    {
        // Busca todas as categorias de risco no banco de dados
        $categorias = CategoriaRisco::all();

        // Retorna a coleção como uma resposta JSON
        return response()->json($categorias);
    }
}