<?php

namespace App\Http\Traits;

use App\Models\LogAuditoria;
use Illuminate\Support\Facades\Auth;

trait AuditoriaTrait
{
    protected function registrarAuditoria($pacienteId, $tipoOperacao, $dadoAcessado = null)
    {
        $usuarioId = Auth::id();
        
        // Registra apenas operações que alteram dados
        $operacoesImportantes = ['criacao', 'edicao', 'exclusao', 'alta', 'desfecho'];
        
        if ($usuarioId && in_array($tipoOperacao, $operacoesImportantes)) {
            LogAuditoria::create([
                'usuario_id' => $usuarioId,
                'paciente_id' => $pacienteId,
                'data_hora' => now(),
                'tipo_operacao' => $tipoOperacao,
                'dado_acessado' => $dadoAcessado
            ]);
        }
    }
}