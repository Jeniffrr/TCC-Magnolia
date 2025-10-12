<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Hospital;

class HospitalSeeder extends Seeder
{
    public function run(): void
    {
        Hospital::firstOrCreate(
            ['cnpj' => '12.345.678/0001-90'],
            [
                'nome' => 'Hospital Municipal de Goiânia',
                'cnes' => '1234567',
                'endereco' => 'Rua das Flores, 123',
            ]
        );
        
        Hospital::firstOrCreate(
            ['cnpj' => '98.765.432/0001-10'],
            [
                'nome' => 'Hospital Municipal de Anápolis',
                'cnes' => '7654321',
                'endereco' => 'Avenida Central, 456',
            ]
        );
        
        Hospital::firstOrCreate(
            ['cnpj' => '11.222.333/0001-44'],
            [
                'nome' => 'Hospital Regional de Goiâs',
                'cnes' => '1111222',
                'endereco' => 'Rua da Saúde, 789',
            ]
        );
        
        Hospital::firstOrCreate(
            ['cnpj' => '55.666.777/0001-88'],
            [
                'nome' => 'Hospital Santa Casa',
                'cnes' => '3333444',
                'endereco' => 'Praça da Misericórdia, 100',
            ]
        );
    }
}