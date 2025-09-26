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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('email')->unique();
            $table->string('cpf')->unique();
            $table->string('senha');
            $table->enum('tipo_usuario', ['administrador', 'medico', 'enfermeiro', 'tecnico_enfermagem']);
            $table->string('tipo_registro')->nullable();
            $table->string('numero_registro')->nullable();
            $table->boolean('aceitou_termos')->default(false);
            $table->timestamp('consentimento_em')->nullable();
            $table->foreignId('hospital_id')->nullable()->constrained('hospitais')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
