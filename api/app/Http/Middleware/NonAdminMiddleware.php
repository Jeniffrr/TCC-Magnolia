<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NonAdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['message' => 'Não autenticado'], 401);
        }
        
        if ($user->tipo_usuario === 'administrador') {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        return $next($request);
    }
}