<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Scopes\HospitalScope;

class Internacao extends Model
{
    use HasFactory;

    protected $table = 'internacoes';

    protected $fillable = [
        'paciente_id',
        'leito_id',
        'data_entrada',
        'data_alta',
        'motivo_internacao',
        'status',
    ];

    // Uma internação PERTENCE A UMA paciente
    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class);
    }

    // Uma internação PERTENCE A UM leito
    public function leito(): BelongsTo
    {
        return $this->belongsTo(Leito::class);
    }

    // Uma internação TEM MUITOS atendimentos
    public function atendimentos(): HasMany
    {
        return $this->hasMany(Atendimento::class);
    }

    // Uma internação TEM UM evento de parto/desfecho
    public function desfecho(): HasOne
    {
        // Uma internação tem um desfecho
        return $this->hasOne(DesfechoInternacao::class);
    }

    public function alta(): HasOne
    {
        return $this->hasOne(Alta::class);
    }
    // HospitalScope removido - internacoes não tem hospital_id
    // O filtro por hospital é feito através da relação com paciente
}
