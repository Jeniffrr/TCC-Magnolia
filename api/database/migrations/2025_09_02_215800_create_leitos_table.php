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
        Schema::create('leitos', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->unique();
            $table->enum('tipo', ['Enfermaria', 'Alojamento Conjunto', 'UTI Neonatal']);
            $table->integer('capacidade_maxima')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leitos');
    }
};
