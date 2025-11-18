<?php

namespace App\Http\Controllers;

use App\Models\LogAuditoria;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LogAuditoriaController extends Controller
{
    // Método removido - admin não deve ver logs detalhados com dados de pacientes

    public function byPaciente($pacienteId): JsonResponse
    {
        $logs = LogAuditoria::where('paciente_id', $pacienteId)
            ->with(['usuario'])
            ->orderBy('data_hora', 'desc')
            ->get();
            
        return response()->json($logs);
    }

    public function estatisticas(): JsonResponse
    {
        $stats = [
            'total_operacoes' => LogAuditoria::count(),
            'operacoes_hoje' => LogAuditoria::whereDate('data_hora', today())->count(),
            'operacoes_semana' => LogAuditoria::whereBetween('data_hora', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'por_tipo' => LogAuditoria::selectRaw('tipo_operacao, COUNT(*) as total')
                ->groupBy('tipo_operacao')
                ->get(),
            'usuarios_mais_ativos' => LogAuditoria::selectRaw('usuario_id, COUNT(*) as total')
                ->with(['usuario' => function($query) {
                    $query->select('id', 'nome'); // Apenas nome, sem dados sensíveis
                }])
                ->groupBy('usuario_id')
                ->orderBy('total', 'desc')
                ->limit(10)
                ->get()
        ];
        
        return response()->json($stats);
    }
}