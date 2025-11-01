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
        Schema::create('altas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internacao_id')->constrained('pacientes')->onDelete('cascade');
            $table->foreignId('usuario_id')->constrained('usuarios');
            $table->dateTime('data_hora');
            $table->text('resumo_alta')->nullable();
            $table->text('orientacoes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('altas');
    }
};
