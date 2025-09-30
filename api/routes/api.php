<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Controllers\PrimeiroAcessoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\TwoFactorController;
use App\Models\Usuario;


/*
|--------------------------------------------------------------------------
| Rotas da API
|--------------------------------------------------------------------------
|
| Estas rotas recebem automaticamente o prefixo '/api' e devem ser
| acessadas com a autenticação do Sanctum.
|
*/

Route::post('/primeiro-acesso/registrar', [PrimeiroAcessoController::class, 'registrar']); // Rota para o registro inicial (não precisa de autenticação)
Route::post('/login', [LoginController::class, 'login']); // Rota para o login principal (email + senha)
// Route::post('/login/two-factor', [TwoFactorController::class, 'verify']); // Rota para verificar o código 2FA

Route::get('/tipos-registro', function () {
    return response()->json([
        'CRM',
        'COREN',
        'CRO',
        'Outro'
    ]);
});

Route::get('/ufs', function () {
    return response()->json([
        'AC',
        'AL',
        'AP',
        'AM',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MT',
        'MS',
        'MG',
        'PA',
        'PB',
        'PR',
        'PE',
        'PI',
        'RJ',
        'RN',
        'RS',
        'RO',
        'RR',
        'SC',
        'SP',
        'SE',
        'TO'
    ]);
});

Route::get('/tipos-usuario', function () {
    return response()->json(Usuario::TIPOS_VALIDOS);
});

// Rotas protegidas que exigem autenticação Sanctum
Route::middleware('auth:sanctum')->group(function () {

    // Rota para obter o usuário logado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Rotas protegidas apenas para administradores
    Route::middleware(AdminMiddleware::class)->group(function () {
        // Rotas de administrador
        // CRUD Completo de Usuários
        Route::post('/usuarios/cadastrar', [UsuarioController::class, 'cadastrar']); // Cadastrar novo usuário
        Route::get('/usuarios', [UsuarioController::class, 'index']); // Visualizar todos
        Route::get('/usuarios/{id}', [UsuarioController::class, 'show']); // Visualizar um específico
        Route::put('/usuarios/{id}', [UsuarioController::class, 'update']); // Editar
        Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']); // Apagar
        Route::patch('/usuarios/{id}/status', [UsuarioController::class, 'toggleStatus']); // Desativar/Ativar
    });
});
