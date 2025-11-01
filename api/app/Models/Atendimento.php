<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Atendimento extends Model
{
    use HasFactory;

    protected $fillable = [
        'internacao_id',
        'usuario_id',
        'categoria_risco_id',
        'data_hora',
        'frequencia_cardiaca',
        'pressao_sistolica',
        'pressao_diastolica',
        'temperatura',
        'frequencia_respiratoria',
        'evolucao_maternidade',
        'avaliacao_fetal',
        'bcf',
        'movimentos_fetais_presentes',
        'altura_uterina', 
    ];

    // Um atendimento PERTENCE A UMA internação
    public function internacao(): BelongsTo
    {
        return $this->belongsTo(Internacao::class);
    }

    // Um atendimento PERTENCE A UM profissional (usuário)
    public function profissional(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    // Um atendimento PERTENCE A UMA categoria de risco
    public function categoriaRisco(): BelongsTo
    {
        return $this->belongsTo(CategoriaRisco::class);
    }

    // Um atendimento TEM MUITOS exames
    public function examesLaboratoriais(): HasMany
    {
        return $this->hasMany(ExameLaboratorial::class);
    }

    // Um atendimento TEM MUITOS medicamentos administrados
    public function medicamentosAdministrados(): HasMany
    {
        return $this->hasMany(MedicacaoAdministrada::class);
    }

    // Um atendimento TEM MUITAS ocorrências clínicas
    public function ocorrenciasClinicas(): HasMany
    {
        return $this->hasMany(OcorrenciaClinica::class);
    }

    // Um atendimento TEM MUITOS procedimentos realizados
    public function procedimentosRealizados(): HasMany
    {
        return $this->hasMany(ProcedimentoRealizado::class);
    }
}
