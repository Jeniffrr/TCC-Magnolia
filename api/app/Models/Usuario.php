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
    
    // Tipos de usuário
    public const TIPO_ADMINISTRADOR = 'administrador';
    public const TIPO_MEDICO = 'medico';
    public const TIPO_ENFERMEIRO = 'enfermeiro';
    public const TIPO_TECNICO_ENFERMAGEM = 'tecnico_enfermagem';
    public const TIPOS_VALIDOS = [
        self::TIPO_ADMINISTRADOR,
        self::TIPO_MEDICO,
        self::TIPO_ENFERMEIRO,
        self::TIPO_TECNICO_ENFERMAGEM,
    ];

    protected $fillable = [
        'nome',
        'email',
        'cpf',
        'senha',
        'tipo_usuario',
        'tipo_registro',
        'numero_registro',
        'uf_registro',
        'is_active',
        'aceitou_termos',
        'consentimento_em',
        'consentimento_lgpd_aceito',
        'data_consentimento_lgpd',
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

    /**
     * Get the password for the user.
     */
    public function getAuthPassword()
    {
        return $this->senha;
    }

    /**
     * Get the name of the password field.
     */
    public function getAuthPasswordName()
    {
        return 'senha';
    }

    /**
     * Override the password attribute to use 'senha'
     */
    public function getPasswordAttribute()
    {
        return $this->senha;
    }

    /**
     * Get the name of the unique identifier for the user.
     */
    public function getAuthIdentifierName()
    {
        return 'email';
    }

    /**
     * Get the unique identifier for the user.
     */
    public function getAuthIdentifier()
    {
        return $this->email;
    }
}
