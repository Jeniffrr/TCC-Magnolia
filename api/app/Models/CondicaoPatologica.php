<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CondicaoPatologica extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['nome'];

    public function pacientes(): BelongsToMany {
        return $this->belongsToMany(
            Paciente::class, 
            'paciente_condicaos', 
            'condicao_id', 
            'paciente_id'
        )->withTimestamps();
    }
}
