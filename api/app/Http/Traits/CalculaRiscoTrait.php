<?php

namespace App\Http\Traits; 

use App\Models\CategoriaRisco;
use App\Models\CondicaoPatologica;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

trait CalculaRiscoTrait
{
   protected function calcularCategoriaRisco(array $dadosValidados, ?int $categoriaAtual = null): int
    {
        // 1. Busca os IDs das categorias (com cache)
        $categorias = Cache::remember('categorias_risco_v2', 60, function () {
            return CategoriaRisco::pluck('id', 'nome');
        });

        $idAborto = $categorias['Aborto'] ?? 4;
        $idAlto = $categorias['Alto'] ?? 3;
        $idMedio = $categorias['Médio'] ?? 2;
        $idNormal = $categorias['Normal'] ?? 1;

        // 2. Coleta e processa os dados
        $nomesCondicoes = $this->getNomesCondicoes($dadosValidados['condicoes_patologicas'] ?? []);
        $motivo = strtolower($dadosValidados['motivo_internacao'] ?? '');
        $avaliacaoFetalTexto = strtolower($dadosValidados['avaliacao_fetal'] ?? '');
        $idade = Carbon::parse($dadosValidados['data_nascimento'])->age;
        
        // Sinais Vitais
        $sistolica = $dadosValidados['pressao_sistolica'] ?? null;
        $diastolica = $dadosValidados['pressao_diastolica'] ?? null;
        $temperatura = $dadosValidados['temperatura'] ?? null;
        $bcf = $dadosValidados['bcf'] ?? null;
        $movFetal = $dadosValidados['movimentos_fetais_presentes'] ?? null;
        $fc = $dadosValidados['frequencia_cardiaca'] ?? null;
        $fr = $dadosValidados['frequencia_respiratoria'] ?? null;
        $au = $dadosValidados['altura_uterina'] ?? null;
        $semanasGestacao = $dadosValidados['semanas_gestacao'] ?? null;

        // --- REGRA NÍVEL 1: Aborto / Óbito Fetal ---

        $ehAmeaca = str_contains($motivo, 'ameaça') || str_contains($motivo, 'ameaca');
        
        if ($categoriaAtual === $idAborto) return $idAborto;

        if (
            // Só classifica como Aborto se NÃO for apenas uma ameaça
            (!$ehAmeaca && str_contains($motivo, 'aborto')) ||
            
            (isset($bcf) && $bcf == 0) || // BCF 0 confirma óbito
            str_contains($avaliacaoFetalTexto, 'sem bcf') ||
            str_contains($avaliacaoFetalTexto, 'óbito') ||
            str_contains($avaliacaoFetalTexto, 'inviável')
        ) {
            return $idAborto;
        }

        // --- REGRA NÍVEL 2: Alto Risco ---
        if (
            // 1. Fatores de Pressão Arterial Críticos
            ($sistolica !== null && $sistolica >= 140) || // Estágio 2
            ($diastolica !== null && $diastolica >= 90) || // Estágio 2
            ($sistolica !== null && $sistolica < 90) ||   // Hipotensão
            ($diastolica !== null && $diastolica < 60) ||  // Hipotensão

            // 2. Condições Patológicas Graves
            $ehAmeaca ||
            in_array('pré-eclâmpsia', $nomesCondicoes) ||
            in_array('diabetes mellitus tipo 1', $nomesCondicoes) ||
            in_array('hipertensão crônica grave', $nomesCondicoes) ||

            // 3. Fatores Maternos e Fetais Críticos
            $idade > 35 || // Idade avançada (retornado para Alto Risco)
            $idade < 18 || // Adolescência (retornado para Alto Risco)
            ($temperatura !== null && $temperatura >= 38.5) ||
            (isset($bcf) && ($bcf < 110 || $bcf > 160)) || 
            ($movFetal !== null && $movFetal === false)
        ) {
            return $idAlto;
        }

        // --- REGRA NÍVEL 3: Médio Risco ---
        
        // Validação da Altura Uterina (+- 2cm entre 20 e 36 semanas)
        $auAnormal = false;
        if ($au !== null && $semanasGestacao !== null && $semanasGestacao >= 20 && $semanasGestacao <= 36) {
            if (abs($semanasGestacao - $au) > 2) {
                $auAnormal = true;
            }
        }

        // Definição dinâmica do limite respiratório baseada na idade
        // Padrão: 12-20. Adolescentes (13-18): 12-16. Adultos >40: 16-25.
        $limiteMinFr = 12;
        $limiteMaxFr = 20;

        if ($idade >= 13 && $idade <= 18) {
            $limiteMaxFr = 16; 
        } elseif ($idade > 40) {
            $limiteMaxFr = 25;
            $limiteMinFr = 16;
        }

        $frAnormal = false;
        if ($fr !== null) {
            if ($fr < $limiteMinFr || $fr > $limiteMaxFr) {
                $frAnormal = true;
            }
        }

        $temCesareaAnterior = $this->checarCesareaAnterior($dadosValidados['gestacoes_anteriores'] ?? []);

        if (
            // Hipertensão Estágio 1 (>= 130/80)
            ($sistolica !== null && $sistolica >= 130) || 
            ($diastolica !== null && $diastolica > 80) ||
            
            // Sinais Vitais Alterados (Moderados)
            ($fc !== null && ($fc < 60 || $fc > 100)) ||
            $frAnormal || // Usa a lógica dinâmica de idade
            $auAnormal ||

           
            $temCesareaAnterior ||
            in_array('diabetes gestacional', $nomesCondicoes) ||
            !empty($dadosValidados['alergias']) || 
            !empty($dadosValidados['medicamentos_continuos'])
        ) {
            return $idMedio;
        }

        // --- REGRA NÍVEL 4: Risco Normal ---
        return $idNormal;
    }
    
    private function getNomesCondicoes(array $condicoesIDs): array
    {
        if (empty($condicoesIDs)) {
            return [];
        }
        return CondicaoPatologica::whereIn('id', $condicoesIDs)
                                ->pluck('nome')
                                ->map(fn($nome) => strtolower($nome))
                                ->toArray();
    }

    private function checarCesareaAnterior(array $gestacoes): bool
    {
        foreach ($gestacoes as $gest) {
            if (str_contains(strtolower($gest['tipo_parto'] ?? ''), 'cesárea')) {
                return true;
            }
        }
        return false;
    }
}