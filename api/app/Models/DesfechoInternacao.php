<?php

namespace App\Models;

use App\Models\Scopes\HospitalScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DesfechoInternacao extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'desfechos_internacao';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'internacao_id',
        'usuario_id',
        'data_hora_parto',
        'tipo',
        'data_hora_evento',
        'semana_gestacional',
        'tipo_parto',
        'observacoes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'data_hora_parto' => 'datetime',
    ];

    /**
     * Aplica o escopo global do hospital ao modelo.
     */
    protected static function booted()
    {
        static::addGlobalScope(new HospitalScope);
    }
   public function internacao(): BelongsTo
    {
        return $this->belongsTo(Internacao::class);
    }
    
    // Um desfecho PODE TER MUITOS recém-nascidos (para gêmeos, etc)
    // Este relacionamento só fará sentido se o tipo for 'Parto'
    public function recemNascidos(): HasMany
    {
        return $this->hasMany(RecemNascido::class);
    }
}
