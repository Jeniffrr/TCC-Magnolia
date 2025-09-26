<?php

namespace App\Models;

use App\Models\Scopes\HospitalScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Internacao extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'paciente_id',
        'leito_id',
        'usuario_id',
        'data_entrada',
        'data_saida',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'data_entrada' => 'datetime',
        'data_saida' => 'datetime',
    ];

    /**
     * Aplica o escopo global do hospital ao modelo.
     */
    protected static function booted()
    {
        static::addGlobalScope(new HospitalScope);
    }
}
