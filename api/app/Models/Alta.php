<?php

namespace App\Models;

use App\Models\Scopes\HospitalScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alta extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'internacao_id',
        'usuario_id',
        'data_hora',
        'resumo_alta',
        'orientacoes',
    ];

    public function internacao(): BelongsTo
    {
        return $this->belongsTo(Internacao::class);
    }
    
    public function profissional(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'data_hora' => 'datetime',
    ];

    /**
     * Disable global scopes for this model
     */
    protected static function booted()
    {
        // Remove any global scopes that might be inherited
    }
}
