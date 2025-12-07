<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PragmaRX\Google2FA\Google2FA;
use App\Models\Usuario;

class TwoFactorController extends Controller
{
    public function enable(Request $request)
    {
        /** @var Usuario $user */
        $user = Auth::user();
        
        if ($user->two_factor_secret) {
            return response()->json([
                'message' => '2FA já está ativado.'
            ], 400);
        }

        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();
        
        // Salva o secret temporariamente (será confirmado após verificação)
        $user->two_factor_secret = $secret;
        $user->save();

        // Gera o QR Code URL
        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        return response()->json([
            'secret' => $secret,
            'qr_code_url' => $qrCodeUrl,
        ]);
    }

    public function confirm(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        /** @var Usuario $user */
        $user = Auth::user();
        
        if (!$user->two_factor_secret) {
            return response()->json([
                'message' => '2FA não foi iniciado.'
            ], 400);
        }

        $google2fa = new Google2FA();
        $valid = $google2fa->verifyKey($user->two_factor_secret, $request->code);

        if (!$valid) {
            return response()->json([
                'message' => 'Código inválido.'
            ], 401);
        }

        // Confirma a ativação do 2FA
        $user->two_factor_confirmed_at = now();
        $user->save();

        return response()->json([
            'message' => '2FA ativado com sucesso!'
        ]);
    }

    public function disable(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        /** @var Usuario $user */
        $user = Auth::user();

        // Verifica a senha antes de desativar
        if (!password_verify($request->password, $user->password)) {
            return response()->json([
                'message' => 'Senha incorreta.'
            ], 401);
        }

        $user->two_factor_secret = null;
        $user->two_factor_confirmed_at = null;
        $user->save();

        return response()->json([
            'message' => '2FA desativado com sucesso!'
        ]);
    }

    public function status()
    {
        /** @var Usuario $user */
        $user = Auth::user();
        
        return response()->json([
            'enabled' => !empty($user->two_factor_secret),
            'confirmed' => !empty($user->two_factor_confirmed_at),
        ]);
    }
}
