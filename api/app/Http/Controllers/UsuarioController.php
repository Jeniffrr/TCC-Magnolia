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
    // Método para Visualizar TODOS os Usuários (Listagem)
    /**
     * Retorna a lista paginada de usuários (profissionais de saúde)
     * pertencentes ao mesmo hospital do administrador logado.
     */
    public function index(Request $request)
    {
        // 1. Obtém o ID do hospital do administrador logado
        $hospitalId = $request->user()->hospital_id;

        // 2. Consulta no banco de dados
        $usuarios = Usuario::select('id', 'nome', 'email', 'tipo_usuario', 'tipo_registro', 'numero_registro', 'uf_registro', 'is_active')
            ->where('hospital_id', $hospitalId)
            // 3. Exclui o próprio administrador e outros administradores da lista
            ->where('tipo_usuario', '!=', Usuario::TIPO_ADMINISTRADOR)
            // 4. Adiciona ordenação e paginação para performance
            ->orderBy('nome', 'asc')
            ->paginate(10);

        return response()->json($usuarios, 200);
    }

    // Método para Visualizar UM Usuário específico
    /**
     * Retorna os detalhes de um usuário específico, verificando a posse pelo hospital.
     */
    public function show(Request $request, string $id)
    {
        // 1. Busca o usuário pelo ID
        $usuario = Usuario::where('id', $id)
            // 2. Filtra para garantir que pertence ao hospital do admin logado
            ->where('hospital_id', $request->user()->hospital_id)
            ->first(); // Usa first() para lidar com o caso de não encontrado

        // 3. Checa se o usuário existe e foi encontrado dentro do hospital
        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado ou acesso não autorizado.'], 404);
        }

        // 4. Retorna os dados, incluindo campos confidenciais para edição
        return response()->json($usuario, 200);
    }

    // Método para Editar (Update) um Usuário
    /**
     * Atualiza os dados de um usuário específico.
     */
    public function update(Request $request, string $id)
    {
        // 1. Localiza o Usuário e Garante a Posse (Segurança)
        $usuario = Usuario::where('id', $id)
            ->where('hospital_id', $request->user()->hospital_id)
            ->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado ou acesso negado.'], 404);
        }

        // 2. Regras de Validação Flexíveis
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

        // 3. Prepara os Dados para Atualização
        $data = $request->except('senha', 'senha_confirmation');

        // Se uma NOVA senha for fornecida, faça o Hash
        if ($request->filled('senha')) {
            $data['senha'] = Hash::make($request->senha);
        } else {
            // Remove a senha do array se estiver vazia para não sobrescrever com null
            unset($data['senha']);
        }

        // 4. Executa a Atualização
        $usuario->update($data);

        // 5. Retorna Resposta
        return response()->json([
            'message' => 'Profissional atualizado com sucesso!',
            'usuario' => $usuario->fresh()
        ], 200);
    }

    // Método para Desativar/Ativar um Usuário
    /**
     * Alterna o status (ativo/inativo) de um usuário.
     * Usa o método HTTP PATCH.
     */
    public function toggleStatus(Request $request, string $id)
    {
        // 1. Localiza o Usuário e Garante a Posse (Segurança)
        $usuario = Usuario::where('id', $id)
            ->where('hospital_id', $request->user()->hospital_id)
            ->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado ou acesso negado.'], 404);
        }

        // 2. Proteção: Impedir o administrador de desativar a si mesmo
        if ($usuario->id === $request->user()->id) {
            return response()->json(['message' => 'Você não pode desativar sua própria conta através desta ação.'], 403);
        }

        // 3. Alterna o status
        $novoStatus = !$usuario->is_active;

        $usuario->update(['is_active' => $novoStatus]);

        // 4. Retorna a Resposta
        $mensagem = "Usuário {$usuario->nome} foi " . ($novoStatus ? 'ativado' : 'desativado') . " com sucesso.";

        return response()->json([
            'message' => $mensagem,
            'is_active' => $novoStatus
        ], 200);
    }

    // Método para Apagar um Usuário
    /**
     * Remove permanentemente um usuário do banco de dados (DELETE).
     */
    public function destroy(Request $request, string $id)
    {
        // 1. Localiza o Usuário e Garante a Posse (Segurança)
        $usuario = Usuario::where('id', $id)
            ->where('hospital_id', $request->user()->hospital_id)
            ->first();

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado ou acesso negado.'], 404);
        }

        // 2. Proteção: Impedir o administrador de apagar a si mesmo
        if ($usuario->id === $request->user()->id) {
            return response()->json(['message' => 'Você não pode apagar sua própria conta.'], 403);
        }

        // 3. Executa a Exclusão
        $usuario->delete();

        // 4. Retorna a Resposta
        return response()->json([
            'message' => "Usuário '{$usuario->nome}' removido permanentemente com sucesso."
        ], 200);
    }
}
