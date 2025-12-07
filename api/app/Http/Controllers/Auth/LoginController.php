<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Usuario;

class LoginController extends Controller
{
    /**
     * Lógica de login simples que emite o token Sanctum diretamente.
     */
    public function login(Request $request)
    {
        // 1. Tenta autenticar o usuário com as credenciais (email/senha)
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            /** @var Usuario $user */
            $user = Auth::user();

            // 2. Verifica se o usuário está ativo
            if (!$user->is_active) {
                Auth::logout();
                return response()->json([
                    'message' => 'Usuário desativado. Entre em contato com o administrador.'
                ], 401);
            }

            // 3. 2FA é SEMPRE obrigatório
            $google2fa = new \PragmaRX\Google2FA\Google2FA();
            
            // Se não tem 2FA configurado, gera automaticamente
            if (!$user->two_factor_secret) {
                $secret = $google2fa->generateSecretKey();
                $user->two_factor_secret = $secret;
                $user->save();
            }
            
            // Sempre requer 2FA
            session(['2fa_user_id' => $user->id]);
            Auth::logout(); // Desloga temporariamente
            
            $qrCodeUrl = null;
            if (!$user->two_factor_confirmed_at) {
                // Gera QR Code como SVG
                $qrCodeText = $google2fa->getQRCodeUrl(
                    config('app.name'),
                    $user->email,
                    $user->two_factor_secret
                );
                
                $renderer = new \BaconQrCode\Renderer\ImageRenderer(
                    new \BaconQrCode\Renderer\RendererStyle\RendererStyle(200),
                    new \BaconQrCode\Renderer\Image\SvgImageBackEnd()
                );
                $writer = new \BaconQrCode\Writer($renderer);
                $qrCodeSvg = $writer->writeString($qrCodeText);
                $qrCodeUrl = 'data:image/svg+xml;base64,' . base64_encode($qrCodeSvg);
            }
            
            return response()->json([
                'message' => 'Código de 2FA é necessário.',
                'two_factor_required' => true,
                'user_id' => $user->id,
                'qr_code_url' => $qrCodeUrl,
                'secret' => !$user->two_factor_confirmed_at ? $user->two_factor_secret : null,
                'first_time' => !$user->two_factor_confirmed_at,
            ], 200);
        }

        // 4. Se a autenticação falhar
        return response()->json([
            'message' => 'Credenciais inválidas.'
        ], 401);
    }

    public function twoFactorChallenge(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'code' => 'required|string|size:6',
        ]);

        $user = Usuario::find($request->user_id);

        if (!$user || !$user->two_factor_secret) {
            return response()->json([
                'message' => 'Usuário inválido ou 2FA não configurado.'
            ], 401);
        }

        // Verifica o código 2FA
        $google2fa = new \PragmaRX\Google2FA\Google2FA();
        $valid = $google2fa->verifyKey($user->two_factor_secret, $request->code);

        if (!$valid) {
            return response()->json([
                'message' => 'Código inválido.'
            ], 401);
        }

        // Marca como confirmado na primeira vez
        if (!$user->two_factor_confirmed_at) {
            $user->two_factor_confirmed_at = now();
            $user->save();
        }

        // Autentica o usuário
        Auth::login($user);
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login bem-sucedido!',
            'user' => $user,
            'token' => $token,
        ], 200);
    }
    // public function login(Request $request)
    // {
    //     $credentials = $request->only('email', 'password');

    //     if (Auth::attempt($credentials)) {
    //         $user = Auth::user();

    //         if ($user->two_factor_secret) {
    //             // Se 2FA ativado, retorne uma resposta indicando a necessidade do código
    //             return response()->json([
    //                 'message' => 'Código de 2FA é necessário.',
    //                 'two_factor_required' => true,
    //                 'user_id' => $user->id, // O front-end precisará do ID para a próxima requisição
    //             ], 200);
    //         }

    //         // Se 2FA não ativado, gere e retorne o token Sanctum
    //         $token = $user->createToken('auth-token')->plainTextToken;
    //         return response()->json([
    //             'user' => $user,
    //             'token' => $token,
    //         ]);
    //     }

    //     // Se a autenticação falhar
    //     return response()->json([
    //         'message' => 'Credenciais inválidas.'
    //     ], 401);
    // }
}
