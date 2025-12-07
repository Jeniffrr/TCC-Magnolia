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
        'usuario_id',
        'leito_id',
        'data_entrada',
        'data_alta',
        'motivo_internacao',
        'status',
    ];

    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class);
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class);
    }

    public function leito(): BelongsTo
    {
        return $this->belongsTo(Leito::class);
    }

    public function atendimentos(): HasMany
    {
        return $this->hasMany(Atendimento::class);
    }

    public function desfecho(): HasOne
    {
        return $this->hasOne(DesfechoInternacao::class);
    }

    public function alta(): HasOne
    {
        return $this->hasOne(Alta::class);
    }
}
