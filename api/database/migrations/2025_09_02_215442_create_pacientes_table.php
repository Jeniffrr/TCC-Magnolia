<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pacientes', function (Blueprint $table) {
            $table->id();
            // Chaves estrangeiras para auditoria e organização
            $table->foreignId('usuario_id')->constrained('usuarios');
            $table->foreignId('hospital_id')->constrained('hospitais');

            // Dados Pessoais  (Permanentes)
            $table->string('nome_completo');
            $table->string('cpf')->unique();
            $table->string('nome_mae');
            $table->date('data_nascimento');
            $table->string('telefone')->nullable();

            // Endereço
            $table->string('rua')->nullable();
            $table->string('numero')->nullable();
            $table->string('bairro')->nullable();
            $table->string('cidade')->nullable();
            $table->string('estado')->nullable();
            $table->string('cep')->nullable();

            // Histórico Médico Geral
            $table->text('alergias')->nullable();
            $table->text('medicamentos_continuos')->nullable();

            // Termos e Condições
            $table->boolean('consentimento_lgpd_aceito')->default(false);
            $table->dateTime('data_consentimento_lgpd')->nullable();

            $table->timestamps(); // created_at e updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pacientes');
    }
};
