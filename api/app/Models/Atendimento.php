<?php

namespace App\Models;

use App\Models\Scopes\HospitalScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atendimento extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'paciente_id',
        'usuario_id',
        'hospital_id',
        'data_hora',
        'frequencia_cardiaca',
        'pressao_sistolica',
        'pressao_diastolica',
        'temperatura',
        'frequencia_respiratoria',
        'evolucao_maternidade',
        'avaliacao_fetal',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'data_hora' => 'datetime',
    ];

    /**
     * Aplica o escopo global do hospital ao modelo.
     */
    protected static function booted()
    {
        static::addGlobalScope(new HospitalScope);
    }
}
