<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class HospitalScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        // Se o usuário estiver logado e tiver um hospital_id,
        // adiciona a restrição para mostrar apenas os dados desse hospital.
        if (Auth::check() && Auth::user()->hospital_id) {
            $builder->where('hospital_id', Auth::user()->hospital_id);
        }
    }
}
