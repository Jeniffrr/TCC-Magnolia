<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExameLaboratorial extends Model
{
    use HasFactory;
    
    /**
     * Disable global scopes for this model
     */
    protected static function booted()
    {
        // Remove any global scopes that might be inherited
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'atendimento_id',
        'nome',
        'resultado',
        'data_exame',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'data_exame' => 'datetime',
    ];

    /**
     * Relacionamento com atendimento
     */
    public function atendimento()
    {
        return $this->belongsTo(Atendimento::class);
    }
}
