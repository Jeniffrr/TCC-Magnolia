<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Controllers\PrimeiroAcessoController;
use App\Http\Controllers\Admin\UsuarioController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\TwoFactorController;


/*
|--------------------------------------------------------------------------
| Rotas da API
|--------------------------------------------------------------------------
|
| Estas rotas recebem automaticamente o prefixo '/api' e devem ser
| acessadas com a autenticação do Sanctum.
|
*/

// Rota para o registro inicial (não precisa de autenticação)
Route::post('/primeiro-acesso/registrar', [PrimeiroAcessoController::class, 'registrar']);


// Rota para o login principal (email + senha)
Route::post('/login', [LoginController::class, 'login']);

// Rota para verificar o código 2FA
Route::post('/login/two-factor', [TwoFactorController::class, 'verify']);


// Rotas protegidas que exigem autenticação Sanctum
Route::middleware('auth:sanctum')->group(function () {

    // Rota para obter o usuário logado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Rotas protegidas apenas para administradores
    Route::middleware(AdminMiddleware::class)->group(function () {
        // Rotas de administrador
        Route::post('/registrar-usuario', [UsuarioController::class, 'registrar']);
    });
});