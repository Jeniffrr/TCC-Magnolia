<?php

namespace Database\Seeders;

use App\Models\CategoriaRisco;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CategoriaRiscoSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('categoria_riscos')->truncate();
        Schema::enableForeignKeyConstraints();

        DB::table('categoria_riscos')->insert([
            [
                'nome' => 'Normal',
                'cor' => '#28a745', // Verde
                'descricao' => 'Paciente sem riscos aparentes.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Médio',
                'cor' => '#ffc107', // Amarelo
                'descricao' => 'Requer atenção e monitoramento.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Alto',
                'cor' => '#dc3545', // Vermelho
                'descricao' => 'Risco elevado para mãe e/ou feto.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Aborto',
                'cor' => '#6c757d', // Cinza ou outra cor
                'descricao' => 'Internação devido a processo de abortamento.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}