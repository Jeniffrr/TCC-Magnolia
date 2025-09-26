<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hospital;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class PrimeiroAcessoController extends Controller {

    public function registrar(Request $request)
    {
        // Validação dos dados do formulário
        $request->validate([
            'hospital_nome' => ['required', 'string', 'max:255'],
            'cnpj' => ['required', 'string', 'max:255', 'unique:hospitais'],
            'hospital_endereco' => ['required', 'string'],
            'cnes' => ['required', 'string', 'unique:hospitais'],
            'usuario_nome' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:usuarios'],
            'usuario_cpf' => ['required', 'string', 'max:14', 'unique:usuarios,cpf'],
            'senha' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
        
         // Verifica se o usuário (email ou CPF) já está registrado em algum hospital
    // Isso impede que o mesmo usuário registre múltiplos hospitais
    if (Usuario::where('email', $request->email)->orWhere('cpf', $request->usuario_cpf)->exists()) {
        throw ValidationException::withMessages([
            'email' => 'Este usuário já está registrado em outro hospital.',
        ]);
    }
        DB::transaction(function () use ($request) {
            // 1. Criar o Hospital
            $hospital = Hospital::create([
                'nome' => $request->hospital_nome,
                'cnpj' => $request->cnpj,
                'endereco' => $request->hospital_endereco,
                'cnes' => $request->cnes,
            ]);

            // 2. Criar o primeiro usuário (Admin)
            Usuario::create([
                'nome' => $request->usuario_nome,
                'email' => $request->email,
                'cpf' =>  $request->usuario_cpf,
                'senha' => Hash::make($request->senha),
                'tipo_usuario' => 'administrador', // Atribui o perfil de Admin
                'hospital_id' => $hospital->id, // Vincula ao hospital recém-criado
                'consentimento_lgpd_aceito' => true,
                'data_consentimento_lgpd' => now(),
            ]);
        });

        // Retorna uma resposta JSON de sucesso
        return response()->json(['message' => 'Usuario e hospital cadastrados com sucesso!'], 201);
    }
}
