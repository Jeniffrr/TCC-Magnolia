<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use App\Models\Internacao;
use App\Models\Atendimento;
use App\Models\DesfechoInternacao;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function estatisticas(): JsonResponse
    {
        // Total de pacientes
        $totalPacientes = Paciente::count();

        // Total de internações ativas
        $totalInternacoesAtivas = Internacao::where('status', 'ativa')->count();

        // Total de atendimentos no mês atual
        $totalAtendimentosMes = Atendimento::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // Pacientes por classificação de risco (último atendimento)
        $pacientesPorRisco = DB::table('atendimentos as a')
            ->join('categoria_riscos as cr', 'a.categoria_risco_id', '=', 'cr.id')
            ->join('internacoes as i', 'a.internacao_id', '=', 'i.id')
            ->whereIn('a.id', function($query) {
                $query->select(DB::raw('MAX(id)'))
                    ->from('atendimentos')
                    ->groupBy('internacao_id');
            })
            ->where('i.status', 'ativa')
            ->select('cr.nome', 'cr.cor', DB::raw('COUNT(DISTINCT i.paciente_id) as total'))
            ->groupBy('cr.id', 'cr.nome', 'cr.cor')
            ->get()
            ->map(function($item) {
                return [
                    'nome' => $item->nome,
                    'cor' => $item->cor,
                    'total' => (int) $item->total
                ];
            });

        // Desfechos do mês atual
        $desfechosMes = DesfechoInternacao::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->select('tipo', DB::raw('COUNT(*) as total'))
            ->groupBy('tipo')
            ->get()
            ->map(function($item) {
                return [
                    'tipo' => $item->tipo,
                    'total' => (int) $item->total
                ];
            });

        return response()->json([
            'total_pacientes' => $totalPacientes,
            'total_internacoes_ativas' => $totalInternacoesAtivas,
            'total_atendimentos_mes' => $totalAtendimentosMes,
            'pacientes_por_risco' => $pacientesPorRisco,
            'desfechos_mes' => $desfechosMes
        ]);
    }
}
