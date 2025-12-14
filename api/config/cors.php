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

    'allowed_origins' => ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['*'],

    'max_age' => 86400,

    'supports_credentials' => true,

];
