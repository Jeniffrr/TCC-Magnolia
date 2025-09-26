<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Fortify\Fortify;
use App\Models\User;

class TwoFactorController extends Controller
{
    public function verify(Request $request)
    {
        $request->validate([
            'user_id' => 'required',
            'code' => 'required|string',
        ]);

        $user = User::findOrFail($request->user_id);

        if (Fortify::twoFactorChallengePasses($user, $request->code)) {
            // Código 2FA válido, gere o token Sanctum
            $token = $user->createToken('auth-token')->plainTextToken;
            return response()->json([
                'message' => 'Login bem-sucedido!',
                'user' => $user,
                'token' => $token,
            ]);
        }

        return response()->json([
            'message' => 'Código 2FA inválido.'
        ], 401);
    }
}