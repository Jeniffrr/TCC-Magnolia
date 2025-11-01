<?php
namespace App\Http\Controllers;
use App\Models\CondicaoPatologica;
use Illuminate\Http\JsonResponse;

class CondicaoPatologicaController extends Controller {
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse {

        $condicoesPatologicas = CondicaoPatologica::all();
        foreach ($condicoesPatologicas as $condicaoPatologica) {
            $condicaoPatologica->nome = $condicaoPatologica->nome;
        }
        
        return response()->json(CondicaoPatologica::all());
    }
}