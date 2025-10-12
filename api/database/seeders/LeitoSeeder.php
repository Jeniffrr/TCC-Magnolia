<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Leito;

class LeitoSeeder extends Seeder
{
    public function run()
    {
        $tipos = ['UTI', 'Enfermaria', 'Cirurgia', 'Pediatria', 'Maternidade', 'Emergencia', 'Cardiologia', 'Neurologia', 'Ortopedia', 'Oncologia'];
        $hospitais = [1, 2, 3, 4];
        
        // Criar 100 leitos para teste de paginação
        for ($i = 1; $i <= 100; $i++) {
            Leito::firstOrCreate(
                ['numero' => str_pad($i, 3, '0', STR_PAD_LEFT), 'hospital_id' => $hospitais[($i - 1) % 4]],
                [
                    'tipo' => $tipos[array_rand($tipos)],
                    'capacidade_maxima' => rand(1, 4),
                    'created_at' => now()->subDays(rand(1, 60)),
                    'updated_at' => now()->subDays(rand(0, 10)),
                ]
            );
        }
    }
}