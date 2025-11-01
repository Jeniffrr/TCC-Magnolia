<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecemNascido extends Model
{
    use HasFactory;

    protected $fillable = [
        'evento_parto_id',
        'nome_provisorio',
        'sexo',
        'data_hora_nascimento',
        'peso',
        'altura',
        'apgar_1_min',
        'apgar_5_min',
        'observacoes_iniciais',
    ];

    public function desfecho(): BelongsTo
    {
        return $this->belongsTo(DesfechoInternacao::class);
    }
}
