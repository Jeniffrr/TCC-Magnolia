<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Usuario;

class Hospital extends Model
{
    protected $table = 'hospitais';
    protected $fillable = [
        'nome', 
        'cnpj', 
        'cnes', 
        'endereco'
    ];

    public function usuarios()
    {
        return $this->hasMany(Usuario::class);
    }
}
