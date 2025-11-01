<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class NonAdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (auth()->user()->tipo_usuario === 'administrador') {
            return response()->json(['message' => 'Acesso negado'], 403);
        }

        return $next($request);
    }
}