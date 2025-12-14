<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Migra dados de consentimento_em para data_consentimento_lgpd se necessário
        DB::statement('
            UPDATE usuarios 
            SET data_consentimento_lgpd = consentimento_em 
            WHERE data_consentimento_lgpd IS NULL AND consentimento_em IS NOT NULL
        ');

        // Migra aceitou_termos para consentimento_lgpd_aceito se necessário
        DB::statement('
            UPDATE usuarios 
            SET consentimento_lgpd_aceito = aceitou_termos 
            WHERE consentimento_lgpd_aceito = 0 AND aceitou_termos = 1
        ');

        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropColumn(['aceitou_termos', 'consentimento_em']);
        });
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->boolean('aceitou_termos')->default(false);
            $table->timestamp('consentimento_em')->nullable();
        });
    }
};
