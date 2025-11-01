<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('desfechos_internacao', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internacao_id')->constrained('internacoes')->onDelete('cascade');
            $table->foreignId('usuario_id')->constrained('usuarios'); 

            $table->enum('tipo', [
                'Parto',
                'Abortamento Completo',
                'Abortamento Incompleto / Retido',
                'Abortamento Terapêutico', 
                'Natimorto',
                'Gravidez ectópica'
            ]);

            $table->dateTime('data_hora_evento');
            $table->integer('semana_gestacional')->nullable();

            // Campos que só se aplicam ao Parto
            $table->string('tipo_parto')->nullable();

            $table->text('observacoes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('desfechos_internacao');
    }
};
