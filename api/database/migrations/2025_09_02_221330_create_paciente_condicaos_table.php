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
        Schema::create('paciente_condicaos', function (Blueprint $table) {
            $table->foreignId('paciente_id')->constrained('pacientes');
            $table->foreignId('condicao_id')->constrained('condicao_patologicas');
            $table->string('observacao')->nullable();
            $table->primary(['paciente_id', 'condicao_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paciente_condicaos');
    }
};
