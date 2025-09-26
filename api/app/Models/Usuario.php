<?php

namespace App\Models;

use App\Models\Scopes\HospitalScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'nome',
        'email',
        'cpf',
        'senha',
        'tipo_usuario',
        'tipo_registro',
        'numero_registro',
        'aceitou_termos',
        'consentimento_em',
        'hospital_id',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected $hidden = [
        'senha',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

     protected $casts = [
        'email_verified_at' => 'datetime',
        'consentimento_em' => 'datetime',
        'two_factor_confirmed_at' => 'datetime',
        'aceitou_termos' => 'boolean',
    ];

    /**
     * Aplica o escopo global do hospital ao modelo.
     * No caso do usuário, ele é usado para identificar a qual hospital ele pertence.
     */
    
    protected static function booted()
    {
        static::addGlobalScope(new HospitalScope);
    }
}
