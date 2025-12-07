<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Controllers\PrimeiroAcessoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\LeitoController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\TwoFactorController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\AtendimentoController;
use App\Http\Controllers\InternacaoController;
use App\Http\Controllers\CategoriaRiscoController;
use App\Http\Controllers\DesfechoInternacaoController;
use App\Http\Controllers\CondicaoPatologicaController;
use App\Http\Controllers\OcorrenciaClinicaController;
use App\Http\Controllers\LogAuditoriaController;
use App\Http\Controllers\DashboardController;
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
Route::post('/two-factor-challenge', [LoginController::class, 'twoFactorChallenge']); // Rota para verificar o código 2FA (sem autenticação)

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
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
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

        // CRUD Completo de Leitos (exceto index que está disponível para todos)
        Route::post('/leitos', [LeitoController::class, 'store']); // Cadastrar novo leito
        Route::get('/leitos/{id}', [LeitoController::class, 'show']); // Visualizar um específico
        Route::put('/leitos/{id}', [LeitoController::class, 'update']); // Editar
        Route::delete('/leitos/{id}', [LeitoController::class, 'destroy']); // Apagar
        
        // Dashboard administrativo
        Route::get('/dashboard/estatisticas', [DashboardController::class, 'estatisticas']);
    });

    // Rotas protegidas para todos os profissionais (admin e não admin)
    Route::middleware('non_admin')->group(function () {
        // Rotas para profissionais (não admin)

        // --- Gestão de Pacientes (Prontuário Mestre) ---
        // O apiResource já cria as rotas: index, store, show, update
        Route::apiResource('pacientes', PacienteController::class)->except(['destroy']);

        // --- Gestão de Internações e Atendimentos Clínicos ---

        // CRUD completo de internações
        Route::apiResource('internacoes', InternacaoController::class);
        
        // Rota para o DASHBOARD PRINCIPAL (Painel de Leitos)
        Route::get('/internacoes/ativas', [InternacaoController::class, 'ativas'])
            ->name('internacoes.ativas');

        // Rota para registrar o DESFECHO CLÍNICO (Parto, Aborto, etc)
        Route::post('/internacoes/{internacao}/desfecho', [DesfechoInternacaoController::class, 'store'])
            ->name('internacoes.desfecho.store');

        // Ação específica para dar ALTA ADMINISTRATIVA a uma paciente
        Route::post('/internacoes/{internacao}/alta', [InternacaoController::class, 'darAlta'])
            ->name('internacoes.alta');

        // CRUD completo de atendimentos
        Route::apiResource('atendimentos', AtendimentoController::class);
        
        // Buscar atendimentos de um paciente específico
        Route::get('/pacientes/{paciente}/atendimentos', [AtendimentoController::class, 'byPaciente'])
            ->name('pacientes.atendimentos');

        // --- Rotas de Evolução Clínica (Atendimentos) ---
        // Lista todos os atendimentos de uma internação
        Route::get('/internacoes/{internacao}/atendimentos', [AtendimentoController::class, 'byInternacao'])
            ->name('internacoes.atendimentos.index');

        // Cria um novo atendimento (evolução) para uma internação
        Route::post('/internacoes/{internacao}/atendimentos', [AtendimentoController::class, 'storeForInternacao'])
            ->name('internacoes.atendimentos.store');

        // --- Recursos de Apoio (Para popular formulários no frontend) ---
        // Rota para listar as categorias de risco disponíveis
        Route::get('/categoria-riscos', [CategoriaRiscoController::class, 'index'])->name('categoria-riscos.index');
        
        // Rota para listar as condições patológicas (para o formulário de admissão)
        Route::get('/condicoes-patologicas', [CondicaoPatologicaController::class, 'index'])
            ->name('condicoes-patologicas.index');
        
        // --- Rotas de Ocorrências Clínicas ---
        // CRUD completo de ocorrências clínicas
        Route::apiResource('ocorrencias-clinicas', OcorrenciaClinicaController::class);
        
        // Buscar ocorrências de um atendimento específico
        Route::get('/atendimentos/{atendimento}/ocorrencias', [AtendimentoController::class, 'getOcorrencias'])
            ->name('atendimentos.ocorrencias');
        
        // Criar ocorrência para um atendimento específico
        Route::post('/atendimentos/{atendimento}/ocorrencias', [AtendimentoController::class, 'storeOcorrencia'])
            ->name('atendimentos.ocorrencias.store');
            
        // Atualizar ocorrência de um atendimento
        Route::put('/atendimentos/{atendimento}/ocorrencias/{ocorrencia}', [AtendimentoController::class, 'updateOcorrencia'])
            ->name('atendimentos.ocorrencias.update');
            
        // Remover ocorrência de um atendimento
        Route::delete('/atendimentos/{atendimento}/ocorrencias/{ocorrencia}', [AtendimentoController::class, 'destroyOcorrencia'])
            ->name('atendimentos.ocorrencias.destroy');
    });

    // Rotas compartilhadas (acessíveis por admin e não admin)
    Route::get('/leitos', [LeitoController::class, 'index'])->name('leitos.index'); // Listar leitos (todos podem ver)
    
    // Rotas de 2FA
    Route::post('/two-factor/enable', [TwoFactorController::class, 'enable']);
    Route::post('/two-factor/confirm', [TwoFactorController::class, 'confirm']);
    Route::post('/two-factor/disable', [TwoFactorController::class, 'disable']);
    Route::get('/two-factor/status', [TwoFactorController::class, 'status']);
});
