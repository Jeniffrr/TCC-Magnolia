<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriaRisco extends Model
{
    use HasFactory;

    protected $table = 'categoria_riscos';

    protected $fillable = [
        'nome',
        'cor',
        'descricao'
    ];

    public function pacientes()
    {
        return $this->hasMany(Paciente::class);
    }
}