<?php

return [

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'primeiro-acesso/registrar',
        'login',
        'logout',
        'admin/usuarios',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', '*')), // frontend React

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
