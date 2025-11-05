<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
     * Uma gestação anterior pertence a uma paciente
     */
    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class);
    }
}
