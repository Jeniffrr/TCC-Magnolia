<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UsuarioController extends Controller
{
   public function registrar(Request $request)
{
    $user = $request->user(); // administrador logado

    // Se o usuário logado não for administrador, negar acesso
    if ($user->tipo_usuario !== 'administrador') {
        return response()->json(['message' => 'Apenas administradores podem registrar usuários.'], 403);
    }

    $request->validate([
        'nome' => ['required', 'string', 'max:255'],
        'email' => ['required', 'string', 'email', 'max:255', 'unique:usuarios'],
        'cpf' => ['required', 'string', 'max:14', 'unique:usuarios,cpf'],
        'senha' => ['required', 'string', 'min:8', 'confirmed'],
        // Não precisa de hospital_id, pois será o mesmo do admin
    ]);

    // Cria o usuário com o mesmo hospital_id do administrador
    $usuario = Usuario::create([
        'nome' => $request->nome,
        'email' => $request->email,
        'cpf' => $request->cpf,
        'senha' => Hash::make($request->senha),
        'tipo_usuario' => 'usuario', // Tipo padrão
        'hospital_id' => $user->hospital_id, // Mesmo hospital do admin
        'consentimento_lgpd_aceito' => true,
        'data_consentimento_lgpd' => now(),
    ]);

    return response()->json([
        'message' => 'Usuário registrado com sucesso!',
        'usuario' => $usuario
    ], 201);
}
}