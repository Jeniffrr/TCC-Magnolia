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
        Schema::create('atendimentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->constrained('pacientes');
            $table->foreignId('usuario_id')->constrained('usuarios');
            $table->dateTime('data_hora');
            $table->integer('frequencia_cardiaca')->nullable();
            $table->integer('pressao_sistolica')->nullable();
            $table->integer('pressao_diastolica')->nullable();
            $table->float('temperatura')->nullable();
            $table->integer('frequencia_respiratoria')->nullable();
            $table->text('evolucao_maternidade')->nullable();
            $table->text('avaliacao_fetal')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('atendimentos');
    }
};
