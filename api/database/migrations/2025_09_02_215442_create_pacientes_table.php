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
            $table->foreignId('usuario_id')->constrained('usuarios'); // Chave Estrangeira
            $table->foreignId('categoria_risco_id',['normal' , 'medio' , 'alto' , 'aborto']);
            $table->string('nome_completo');
            $table->string('telefone')->nullable();
            $table->date('data_nascimento');
            $table->string('rua')->nullable();
            $table->string('numero')->nullable();
            $table->string('bairro')->nullable();
            $table->string('cidade')->nullable();
            $table->string('estado')->nullable();
            $table->string('cep')->nullable();
            $table->text('alergias')->nullable();
            $table->text('medicamentos_continuos')->nullable();
            $table->boolean('consentimento_lgpd_aceito')->default(false);
            $table->dateTime('data_consentimento_lgpd')->nullable();
            $table->timestamps();
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
