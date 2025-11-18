<?php

namespace App\Http\Traits; 

use App\Models\CategoriaRisco;
use App\Models\CondicaoPatologica;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

trait CalculaRiscoTrait
{
    /**
     * Calcula o ID da categoria de risco com base nos dados clínicos.
     *
     * @param array $dadosValidados Os dados validados do request.
     * @param int|null $categoriaAtual Categoria atual da internação (se existir)
     * @return int O ID da CategoriaRisco
     */
    protected function calcularCategoriaRisco(array $dadosValidados, ?int $categoriaAtual = null): int
    {
        // 1. Busca os IDs das categorias
        $categorias = Cache::remember('categorias_risco_v2', 60, function () {
            return CategoriaRisco::pluck('id', 'nome');
        });

        // Os fallbacks (?? 4) são um risco se os IDs do DB mudarem, 
        // mas é uma decisão de design aceitável para garantir que sempre haja um ID.
        $idAborto = $categorias['Aborto'] ?? 4;
        $idAlto = $categorias['Alto'] ?? 3;
        $idMedio = $categorias['Médio'] ?? 2;
        $idNormal = $categorias['Normal'] ?? 1;

        // 2. Coleta e processa os dados de entrada
        $nomesCondicoes = $this->getNomesCondicoes($dadosValidados['condicoes_patologicas'] ?? []);
        $motivo = strtolower($dadosValidados['motivo_internacao'] ?? '');
        $avaliacaoFetalTexto = strtolower($dadosValidados['avaliacao_fetal'] ?? '');
        $idade = Carbon::parse($dadosValidados['data_nascimento'])->age;
        
        // --- CORREÇÃO DE SEGURANÇA ---
        // Sinais Vitais: O padrão DEVE ser 'null' (não avaliado), e não um valor "normal".
        $sistolica = $dadosValidados['pressao_sistolica'] ?? null;
        $diastolica = $dadosValidados['pressao_diastolica'] ?? null;
        $temperatura = $dadosValidados['temperatura'] ?? null;
        $bcf = $dadosValidados['bcf'] ?? null; // Isto já estava correto
        $movFetal = $dadosValidados['movimentos_fetais_presentes'] ?? null; // 'null' = não avaliado

        // --- INÍCIO DA LÓGICA DE DECISÃO (HIERÁRQUICA) ---

        // REGRA ESPECIAL: Se já está classificada como Aborto, mantém
        if ($categoriaAtual === $idAborto) {
            return $idAborto;
        }

        // REGRA NÍVEL 1: Aborto / Óbito Fetal
        if (
            str_contains($motivo, 'aborto') ||
            (isset($bcf) && $bcf == 0) || // BCF explicitamente 0 (correto)
            str_contains($avaliacaoFetalTexto, 'sem bcf') ||
            str_contains($avaliacaoFetalTexto, 'óbito fetal') ||
            str_contains($avaliacaoFetalTexto, 'inviável')
        ) {
            return $idAborto;
        }

        // REGRA NÍVEL 2: Alto Risco
        // --- CORREÇÃO DE SEGURANÇA ---
        // Adicionada checagem '!== null' para evitar falsos negativos
        if (
            ($sistolica !== null && $sistolica >= 160) || ($diastolica !== null && $diastolica >= 100) || // Hipertensão Grave
            ($temperatura !== null && $temperatura >= 38.5) || // Febre Alta
            $idade > 35 || // Idade materna avançada
            (isset($bcf) && ($bcf < 110 || $bcf > 160)) || // Bradicardia ou Taquicardia Fetal (correto)
            ($movFetal !== null && $movFetal === false) || // Ausência de movimento fetal (explícito 'false')
            in_array('pré-eclâmpsia', $nomesCondicoes) ||
            in_array('diabetes mellitus tipo 1', $nomesCondicoes) ||
            in_array('hipertensão crônica grave', $nomesCondicoes)
        ) {
            return $idAlto;
        }

        // REGRA NÍVEL 3: Médio Risco
        $temCesareaAnterior = $this->checarCesareaAnterior($dadosValidados['gestacoes_anteriores'] ?? []);
        
        // --- CORREÇÃO DE SEGURANÇA ---
        // Adicionada checagem '!== null'
        if (
            (($sistolica !== null && $sistolica >= 140) || ($diastolica !== null && $diastolica >= 90)) || // Hipertensão Leve
            $idade < 18 || // Paciente adolescente
            $temCesareaAnterior || // Cesárea anterior
            in_array('diabetes gestacional', $nomesCondicoes) ||
            !empty($dadosValidados['alergias']) || // Qualquer alergia
            !empty($dadosValidados['medicamentos_continuos']) // Qualquer medicamento contínuo
        ) {
            return $idMedio;
        }

        // REGRA NÍVEL 4: Risco Normal
        return $idNormal;
    }

    /**
     * Função auxiliar para consultar o nome das condições.
     */
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

    /**
     * Função auxiliar para checar histórico de cesárea.
     */
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