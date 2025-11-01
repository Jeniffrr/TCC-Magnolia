<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CondicaoPatologicaSeeder extends Seeder
{
    /**
     * Executa os seeds para a tabela de condições patológicas.
     *
     * @return void
     */
    public function run(): void
    {
        // Usamos Schema::disableForeignKeyConstraints para permitir o truncate
        // e limpar a tabela antes de inserir, evitando duplicatas.
        Schema::disableForeignKeyConstraints();
        DB::table('condicoes_patologicas')->truncate();
        Schema::enableForeignKeyConstraints();

        $condicoes = [
            // Condições de Alto Risco (usadas no Trait)
            ['nome' => 'Pré-eclâmpsia'],
            ['nome' => 'Diabetes Mellitus Tipo 1'],
            ['nome' => 'Hipertensão Crônica Grave'],
            
            // Condições de Médio Risco (usadas no Trait)
            ['nome' => 'Diabetes Gestacional'],
            ['nome' => 'Hipertensão Gestacional (Leve)'],
            
            // Outras condições comuns
            ['nome' => 'Cardiopatia Grave'],
            ['nome' => 'Anemia Severa'],
            ['nome' => 'Obesidade (IMC > 35)'],
            ['nome' => 'Asma'],
            ['nome' => 'Hipotireoidismo'],
            ['nome' => 'Infecção Urinária de Repetição'],
            ['nome' => 'Tabagismo'],
            ['nome' => 'Usuária de Álcool/Drogas'],
            ['nome' => 'Lúpus Eritematoso Sistêmico'],
        ];

        // Adiciona timestamps (created_at, updated_at) para cada registro
        foreach ($condicoes as &$condicao) {
            $condicao['created_at'] = now();
            $condicao['updated_at'] = now();
        }

        // Insere os dados na tabela
        DB::table('condicoes_patologicas')->insert($condicoes);
    }
}
