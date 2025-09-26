<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;

Route::get('/', function () {
    return view('welcome');
});

// // Rota para o cookie CSRF do Sanctum
// Route::get('/sanctum/csrf-cookie', function () {
//     return response('')->cookie('XSRF-TOKEN', csrf_token());
// });

// Rotas de login e logout que usam o controlador do Fortify
Route::middleware('web')->group(function () {
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});

Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
})->middleware('web');