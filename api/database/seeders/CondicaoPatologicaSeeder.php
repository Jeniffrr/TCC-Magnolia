<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CondicaoPatologica;

class CondicaoPatologicaSeeder extends Seeder
{
    public function run(): void
    {
        $condicoes = [
            'Nenhuma',
            'Diabetes Mellitus Tipo 1',
            'Diabetes Mellitus Tipo 2',
            'Diabetes Gestacional',
            'Hipertensão Arterial Crônica',
            'Hipertensão Gestacional',
            'Pré-eclâmpsia',
            'Eclâmpsia',
            'Cardiopatia',
            'Asma',
            'Epilepsia',
            'Hipotireoidismo',
            'Hipertireoidismo',
            'Anemia',
            'Trombofilia',
            'Lúpus Eritematoso Sistêmico',
            'Síndrome Antifosfolípide',
            'HIV/AIDS',
            'Hepatite B',
            'Hepatite C',
            'Sífilis',
            'Toxoplasmose',
            'Rubéola',
            'Citomegalovírus',
            'Herpes Simples',
            'Incompatibilidade Rh',
            'Placenta Prévia',
            'Descolamento Prematuro de Placenta',
            'Ruptura Prematura de Membranas',
            'Trabalho de Parto Prematuro',
            'Crescimento Intrauterino Restrito',
            'Polidrâmnio',
            'Oligodrâmnio',
            'Gemelaridade',
            'Malformações Fetais',
            'Óbito Fetal Anterior',
            'Aborto de Repetição',
            'Cesariana Anterior',
            'Miomatose Uterina',
            'Endometriose',
            'Síndrome dos Ovários Policísticos',
        ];

        foreach ($condicoes as $nome) {
            CondicaoPatologica::create([
                'nome' => $nome,
            ]);
        }
    }
}