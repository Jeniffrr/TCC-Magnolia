<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Não autenticado.'], 401);
        }
        if (auth()->user()->tipo_usuario !== 'administrador') {
            return response()->json(['message' => 'Acesso não autorizado. Apenas administradores podem realizar esta ação.'], 403);
        }

        return $next($request);
}
}