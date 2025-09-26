<?php

namespace App\Models;

use App\Models\Scopes\HospitalScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GestacaoAnterior extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'gestacao_anterior';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'paciente_id',
        'ano_parto',
        'tipo_parto',
        'observacoes',
    ];

    /**
     * Aplica o escopo global do hospital ao modelo.
     */
    protected static function booted()
    {
        static::addGlobalScope(new HospitalScope);
    }
}
