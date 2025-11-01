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
        Schema::create('internacoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')->constrained('pacientes');
            $table->foreignId('leito_id')->nullable()->constrained('leitos'); // O leito que a paciente ocupa
            $table->dateTime('data_entrada');
            $table->dateTime('data_alta')->nullable(); // A data de alta fica aqui!
            $table->text('motivo_internacao')->nullable();
            $table->string('status')->default('ativa'); // Ex: 'ativa', 'finalizada', 'transferida'

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('internacoes');
    }
};
