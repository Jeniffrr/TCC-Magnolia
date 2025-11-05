<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Paciente extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id', 'hospital_id', 'nome_completo', 'cpf', 'nome_mae',
        'data_nascimento', 'telefone', 'rua', 'numero', 'bairro', 'cidade',
        'estado', 'cep', 'alergias', 'ocorrencias_clinicas',
        'medicamentos_continuos', 'consentimento_lgpd_aceito',
        'data_consentimento_lgpd',
    ];

    // Uma paciente TEM MUITAS internações
    public function internacoes(): HasMany
    {
        return $this->hasMany(Internacao::class);
    }

    // Uma paciente TEM MUITAS internações ativas
    public function internacoesAtivas(): HasMany
    {
        return $this->hasMany(Internacao::class)->where('status', 'ativa');
    }

    // Uma paciente TEM MUITAS gestações anteriores
    public function gestacoesAnteriores(): HasMany
    {
        return $this->hasMany(GestacaoAnterior::class);
    }

    // Uma paciente PERTENCE A UM usuário (que a cadastrou)
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }

    // Uma paciente PERTENCE A MUITAS condições patológicas
    public function condicoesPatologicas(): BelongsToMany
    {
        return $this->belongsToMany(
            CondicaoPatologica::class, 
            'paciente_condicaos', 
            'paciente_id', 
            'condicao_id'
        )->withTimestamps();
    }
}