<?php

return [
    'required' => 'O campo :attribute é obrigatório.',
    'email' => 'O campo :attribute deve ser um endereço de e-mail válido.',
    'min' => [
        'string' => 'O campo :attribute deve ter pelo menos :min caracteres.',
    ],
    'confirmed' => 'A confirmação do campo :attribute não confere.',
    'unique' => 'O :attribute já está sendo usado.',
    'max' => [
        'string' => 'O campo :attribute não pode ter mais que :max caracteres.',
    ],

    'attributes' => [
        'nome' => 'nome',
        'email' => 'e-mail',
        'cpf' => 'CPF',
        'senha' => 'senha',
        'senha_confirmation' => 'confirmação da senha',
        'tipo_usuario' => 'tipo de usuário',
        'tipo_registro' => 'tipo de registro',
        'numero_registro' => 'número do registro',
        'uf_registro' => 'UF do registro',
    ],
];