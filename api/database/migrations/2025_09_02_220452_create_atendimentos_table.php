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

            // A MUDANÇA PRINCIPAL: Ligamos o atendimento a uma internação específica.
            $table->foreignId('internacao_id')->constrained('internacoes');
            $table->foreignId('usuario_id')->constrained('usuarios');
            $table->foreignId('categoria_risco_id')->nullable()->constrained('categoria_riscos');
            $table->dateTime('data_hora');

            // Campos de sinais vitais 
            $table->integer('frequencia_cardiaca')->nullable();
            $table->integer('pressao_sistolica')->nullable();
            $table->integer('pressao_diastolica')->nullable();
            $table->float('temperatura')->nullable();
            $table->integer('frequencia_respiratoria')->nullable();

            // Campos de evolução 
            $table->text('evolucao_maternidade')->nullable()->comment('Descrição da evolução da mãe');
            $table->text('avaliacao_fetal')->nullable()->comment('Descrição da avaliação do feto');
            $table->integer('bcf')->nullable()->comment('Batimento Cardíaco Fetal em bpm');
            $table->boolean('movimentos_fetais_presentes')->nullable();
            $table->integer('altura_uterina')->nullable()->comment('Altura uterina em cm');

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
