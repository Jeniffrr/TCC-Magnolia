<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\HospitalScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;;

class Paciente extends Model
{
  use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'usuario_id',
        'hospital_id',
        'categoria_risco',
        'nome_completo',
        'telefone',
        'data_nascimento',
        'rua',
        'numero',
        'bairro',
        'cidade',
        'estado',
        'cep',
        'alergias',
        'medicamentos_continuos',
        'consentimento_lgpd_aceito',
        'data_consentimento_lgpd',
    ];

    /**
     * Aplica o escopo global do hospital ao modelo.
     */
     protected static function booted()
    {
        static::addGlobalScope(new HospitalScope);
    }
}
