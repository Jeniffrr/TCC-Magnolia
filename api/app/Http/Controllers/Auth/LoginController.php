<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            if ($user->two_factor_secret) {
                // Se 2FA ativado, retorne uma resposta indicando a necessidade do código
                return response()->json([
                    'message' => 'Código de 2FA é necessário.',
                    'two_factor_required' => true,
                    'user_id' => $user->id, // O front-end precisará do ID para a próxima requisição
                ], 200);
            }

            // Se 2FA não ativado, gere e retorne o token Sanctum
            $token = $user->createToken('auth-token')->plainTextToken;
            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        }

        // Se a autenticação falhar
        return response()->json([
            'message' => 'Credenciais inválidas.'
        ], 401);
    }
}