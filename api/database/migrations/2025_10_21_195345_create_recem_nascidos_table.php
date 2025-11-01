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
        Schema::create('recem_nascidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('desfecho_internacao_id')->constrained('desfechos_internacao')->onDelete('cascade');
            $table->string('nome_provisorio')->nullable(); // Ex: "RN de [Nome da Mãe]"
            $table->enum('sexo', ['Masculino', 'Feminino', 'Indeterminado']);
            $table->dateTime('data_hora_nascimento');
            
            // Dados Antropométricos
            $table->decimal('peso', 5, 3)->comment('Peso em kg, ex: 3.250');
            $table->integer('altura')->comment('Altura em cm');
            
            // Índice de Apgar
            $table->integer('apgar_1_min')->nullable();
            $table->integer('apgar_5_min')->nullable();
            
            $table->text('observacoes_iniciais')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recem_nascidos');
    }
};
