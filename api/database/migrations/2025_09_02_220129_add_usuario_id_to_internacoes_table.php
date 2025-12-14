<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('internacoes', 'usuario_id')) {
            Schema::table('internacoes', function (Blueprint $table) {
                $table->unsignedBigInteger('usuario_id')->nullable()->after('paciente_id');
            });
        }

        DB::table('internacoes')
            ->whereNull('usuario_id')
            ->update([
                'usuario_id' => DB::raw('(SELECT usuario_id FROM pacientes WHERE pacientes.id = internacoes.paciente_id)')
            ]);

        $foreignKeys = DB::select("
            SELECT CONSTRAINT_NAME 
            FROM information_schema.TABLE_CONSTRAINTS 
            WHERE TABLE_NAME = 'internacoes' 
            AND CONSTRAINT_NAME = 'internacoes_usuario_id_foreign'
        ");

        if (empty($foreignKeys)) {
            Schema::table('internacoes', function (Blueprint $table) {
                $table->foreign('usuario_id')->references('id')->on('usuarios');
            });
        }
    }

    public function down(): void
    {
        Schema::table('internacoes', function (Blueprint $table) {
            $table->dropForeign(['usuario_id']);
            $table->dropColumn('usuario_id');
        });
    }
};
