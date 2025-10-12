<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        Usuario::firstOrCreate(
            ['email' => 'j@hospital.com'],
            [
                'nome' => 'Administrador Sistema',
                'cpf' => '123.456.789-00',
                'senha' => Hash::make('12345678'),
                'tipo_usuario' => 'administrador',
                'tipo_registro' => 'CRM',
                'numero_registro' => '12345',
                'uf_registro' => 'GO',
                'hospital_id' => 1,
                'is_active' => true,
                'consentimento_lgpd_aceito' => true,
                'data_consentimento_lgpd' => now(),
            ]
        );
        
        Usuario::firstOrCreate(
            ['email' => 'j@gmail.com'],
            [
                'nome' => 'Administrador Sistema 2',
                'cpf' => '321.456.789-00',
                'senha' => Hash::make('12345678'),
                'tipo_usuario' => 'administrador',
                'tipo_registro' => 'CRM',
                'numero_registro' => '12346',
                'uf_registro' => 'GO',
                'hospital_id' => 2,
                'is_active' => true,
                'consentimento_lgpd_aceito' => true,
                'data_consentimento_lgpd' => now(),
            ]
        );
        
        Usuario::firstOrCreate(
            ['email' => 'joao@hospital.com'],
            [
                'nome' => 'Dr. João Silva',
                'cpf' => '987.654.321-00',
                'senha' => Hash::make('12345678'),
                'tipo_usuario' => 'medico',
                'tipo_registro' => 'CRM',
                'numero_registro' => '54321',
                'uf_registro' => 'GO',
                'hospital_id' => 1,
                'is_active' => true,
                'consentimento_lgpd_aceito' => true,
                'data_consentimento_lgpd' => now(),
            ]
        );

        Usuario::firstOrCreate(
            ['email' => 'maria@hospital.com'],
            [
                'nome' => 'Enfermeira Maria Santos',
                'cpf' => '456.789.123-00',
                'senha' => Hash::make('12345678'),
                'tipo_usuario' => 'enfermeiro',
                'tipo_registro' => 'COREN',
                'numero_registro' => '98765',
                'uf_registro' => 'GO',
                'hospital_id' => 1,
                'is_active' => true,
                'consentimento_lgpd_aceito' => true,
                'data_consentimento_lgpd' => now(),
            ]
        );

        // Gerar mais usuários para teste de paginação
        $nomes = [
            'Dr. Carlos Oliveira', 'Dra. Ana Costa', 'Enf. Pedro Lima', 'Téc. Julia Rocha',
            'Dr. Roberto Alves', 'Dra. Fernanda Souza', 'Enf. Marcos Silva', 'Téc. Carla Mendes',
            'Dr. Eduardo Santos', 'Dra. Patrícia Ferreira', 'Enf. Ricardo Pereira', 'Téc. Luciana Dias',
            'Dr. Felipe Barbosa', 'Dra. Camila Rodrigues', 'Enf. Thiago Martins', 'Téc. Renata Gomes',
            'Dr. Gabriel Nascimento', 'Dra. Larissa Cardoso', 'Enf. Bruno Araújo', 'Téc. Vanessa Lopes',
            'Dr. Henrique Moreira', 'Dra. Isabela Teixeira', 'Enf. Diego Correia', 'Téc. Priscila Ramos',
            'Dr. Igor Cavalcanti', 'Dra. Natália Freitas', 'Enf. Leonardo Castro', 'Téc. Patricia Ramos',
            'Dr. André Martins', 'Dra. Beatriz Lima', 'Enf. Caio Santos', 'Téc. Daniela Silva',
            'Dr. Evandro Costa', 'Dra. Fabiana Rocha', 'Enf. Gustavo Almeida', 'Téc. Helena Dias',
            'Dr. Ivan Pereira', 'Dra. Juliana Barbosa', 'Enf. Kevin Rodrigues', 'Téc. Luana Cardoso',
            'Dr. Marcelo Nascimento', 'Dra. Nayara Teixeira', 'Enf. Otávio Moreira', 'Téc. Paula Correia',
            'Dr. Quintino Cavalcanti', 'Dra. Rafaela Freitas', 'Enf. Samuel Castro', 'Téc. Tatiana Ramos',
            'Dr. Ulisses Martins', 'Dra. Viviane Lima', 'Enf. Wagner Santos', 'Téc. Ximena Silva',
            'Dr. Yuri Costa', 'Dra. Zara Rocha', 'Enf. Alberto Almeida', 'Téc. Bianca Dias',
            'Dr. Cláudio Pereira', 'Dra. Débora Barbosa', 'Enf. Emerson Rodrigues', 'Téc. Flávia Cardoso',
            'Dr. Gilberto Nascimento', 'Dra. Heloísa Teixeira', 'Enf. Ítalo Moreira', 'Téc. Jéssica Correia'
        ];
        
        $tipos = ['medico', 'enfermeiro', 'tecnico_enfermagem'];
        $registros = ['CRM', 'COREN', 'COREN'];
        $ufs = ['GO', 'SP', 'RJ', 'MG', 'PR', 'SC', 'RS'];
        
        foreach ($nomes as $index => $nome) {
            $tipoIndex = $index % 3;
            $cpfBase = str_pad($index + 100, 3, '0', STR_PAD_LEFT);
            
            $email = strtolower(str_replace([' ', '.'], ['', ''], explode(' ', $nome)[1])) . ($index + 4) . '@hospital.com';
            
            Usuario::firstOrCreate(
                ['email' => $email],
                [
                    'nome' => $nome,
                    'cpf' => $cpfBase . '.456.789-' . str_pad($index, 2, '0', STR_PAD_LEFT),
                    'senha' => Hash::make('12345678'),
                    'tipo_usuario' => $tipos[$tipoIndex],
                    'tipo_registro' => $registros[$tipoIndex],
                    'numero_registro' => str_pad(10000 + $index, 5, '0', STR_PAD_LEFT),
                    'uf_registro' => $ufs[array_rand($ufs)],
                    'hospital_id' => rand(1, 4), // Distribui entre os 4 hospitais
                    'is_active' => rand(0, 10) > 1, // 90% ativos
                    'consentimento_lgpd_aceito' => true,
                    'data_consentimento_lgpd' => now()->subDays(rand(1, 60)),
                ]
            );
        }
    }
}