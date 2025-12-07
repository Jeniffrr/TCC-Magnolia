<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UsuarioController extends Controller
{
    public function cadastrar(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'nome' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:usuarios'],
            'cpf' => ['required', 'string', 'max:14', 'unique:usuarios,cpf'],
            'tipo_usuario' => ['required', 'string', Rule::in(Usuario::TIPOS_VALIDOS)],
            'tipo_registro' => ['required', 'string', 'max:50'],
            'numero_registro' => ['required', 'string', 'max:50'],
            'uf_registro' => ['required', 'string', 'max:2'],
            'senha' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'nome.required' => 'O campo nome é obrigatório.',
            'email.required' => 'O campo e-mail é obrigatório.',
            'email.email' => 'O e-mail deve ser um endereço válido.',
            'email.unique' => 'Este e-mail já está sendo usado.',
            'cpf.required' => 'O campo CPF é obrigatório.',
            'cpf.unique' => 'Este CPF já está sendo usado.',
            'senha.required' => 'O campo senha é obrigatório.',
            'senha.min' => 'A senha deve ter pelo menos 8 caracteres.',
            'senha.confirmed' => 'A confirmação da senha não confere.',
            'tipo_usuario.required' => 'O campo tipo de usuário é obrigatório.',
            'tipo_registro.required' => 'O campo tipo de registro é obrigatório.',
            'numero_registro.required' => 'O campo número do registro é obrigatório.',
            'uf_registro.required' => 'O campo UF do registro é obrigatório.',
        ]);

        // Define o tipo de usuário
        $tipoUsuario = $request->tipo_usuario;

        // Cria o usuário com o mesmo hospital_id do administrador
        $usuario = Usuario::create([
            'nome' => $request->nome,
            'email' => $request->email,
            'cpf' => $request->cpf,
            'tipo_usuario' => $tipoUsuario,
            'tipo_registro' => $request->tipo_registro,
            'numero_registro' => $request->numero_registro,
            'uf_registro' => $request->uf_registro,
            'senha' => Hash::make($request->senha),
            'hospital_id' => $user->hospital_id,
            'is_active' => true,
            'consentimento_lgpd_aceito' => true,
            'data_consentimento_lgpd' => now(),
        ]);

        return response()->json([
            'message' => 'Profissional cadastrado com sucesso!',
            'usuario' => $usuario
        ], 201);
    }
    public function index(Request $request)
    {
        $hospitalId = $request->user()->hospital_id;

        $usuarios = Usuario::select('id', 'nome', 'email', 'tipo_usuario', 'tipo_registro', 'numero_registro', 'uf_registro', 'is_active')
            ->where('hospital_id', $hospitalId)
            ->where('tipo_usuario', '!=', Usuario::TIPO_ADMINISTRADOR)
            ->orderBy('nome', 'asc')
            ->paginate(10);

        return response()->json($usuarios, 200);
    }

    public function show(Request $request, string $id)
    {
        $usuario = Usuario::where('id', $id)
            ->where('hospital_id', $request->user()->hospital_id)
            ->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado ou acesso não autorizado.'], 404);
        }

        return response()->json($usuario, 200);
    }

    public function update(Request $request, string $id)
    {
        $usuario = Usuario::where('id', $id)
            ->where('hospital_id', $request->user()->hospital_id)
            ->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado ou acesso negado.'], 404);
        }

        $request->validate([
            'nome' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('usuarios')->ignore($usuario->id)],
            'cpf' => ['sometimes', 'string', 'max:14', Rule::unique('usuarios')->ignore($usuario->id)],
            'tipo_registro' => ['sometimes', 'string', 'max:50'],
            'numero_registro' => ['sometimes', 'string', 'max:50'],
            'uf_registro' => ['sometimes', 'string', 'max:2'],
            'senha' => ['nullable', 'string', 'min:8', 'confirmed'],
            'tipo_usuario' => ['sometimes', Rule::in(Usuario::TIPOS_VALIDOS)],
        ], [
            'email.email' => 'O e-mail deve ser um endereço válido.',
            'email.unique' => 'Este e-mail já está sendo usado.',
            'cpf.unique' => 'Este CPF já está sendo usado.',
            'senha.min' => 'A senha deve ter pelo menos 8 caracteres.',
            'senha.confirmed' => 'A confirmação da senha não confere.',
        ]);

        $data = $request->except('senha', 'senha_confirmation');

        if ($request->filled('senha')) {
            $data['senha'] = Hash::make($request->senha);
        } else {
            unset($data['senha']);
        }

        $usuario->update($data);

        return response()->json([
            'message' => 'Profissional atualizado com sucesso!',
            'usuario' => $usuario->fresh()
        ], 200);
    }

    public function toggleStatus(Request $request, string $id)
    {
        $usuario = Usuario::where('id', $id)
            ->where('hospital_id', $request->user()->hospital_id)
            ->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado ou acesso negado.'], 404);
        }

        if ($usuario->id === $request->user()->id) {
            return response()->json(['message' => 'Você não pode desativar sua própria conta através desta ação.'], 403);
        }

        $novoStatus = !$usuario->is_active;

        $usuario->update(['is_active' => $novoStatus]);

        $mensagem = "Usuário {$usuario->nome} foi " . ($novoStatus ? 'ativado' : 'desativado') . " com sucesso.";

        return response()->json([
            'message' => $mensagem,
            'is_active' => $novoStatus
        ], 200);
    }

    public function destroy(Request $request, string $id)
    {
        $usuario = Usuario::where('id', $id)
            ->where('hospital_id', $request->user()->hospital_id)
            ->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado ou acesso negado.'], 404);
        }

        if ($usuario->id === $request->user()->id) {
            return response()->json(['message' => 'Você não pode apagar sua própria conta.'], 403);
        }

        $usuario->delete();

        return response()->json([
            'message' => "Usuário '{$usuario->nome}' removido permanentemente com sucesso."
        ], 200);
    }
}
