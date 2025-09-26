<?php

namespace App\Models;

use App\Models\Scopes\HospitalScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class PacienteCondicao extends Pivot
{
    use HasFactory;
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'paciente_condicaos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'paciente_id',
        'condicao_id',
        'observacao',
    ];

    /**
     * Aplica o escopo global do hospital ao modelo.
     */
    protected static function booted()
    {
        static::addGlobalScope(new HospitalScope);
    }
}
