<?php

namespace App\Models;

use App\Models\Scopes\HospitalScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventoParto extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'evento_partos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'paciente_id',
        'usuario_id',
        'hospital_id',
        'data_hora_parto',
        'tipo_parto',
        'condicao_recem_nascido',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'data_hora_parto' => 'datetime',
    ];

    /**
     * Aplica o escopo global do hospital ao modelo.
     */
    protected static function booted()
    {
        static::addGlobalScope(new HospitalScope);
    }
}
