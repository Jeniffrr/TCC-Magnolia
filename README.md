# Sistema de Gestão Hospitalar - Maternidade

Sistema completo para gerenciamento de pacientes em maternidade, com controle de internações, atendimentos, leitos e autenticação 2FA.

## 📋 Índice

- [Requisitos do Sistema](#requisitos-do-sistema)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)

## 🔧 Requisitos do Sistema

- **PHP**: 8.2 ou superior
- **Node.js**: 18.0 ou superior
- **Composer**: 2.0 ou superior
- **XAMPP**: Para Apache e MySQL
- **Navegador**: Chrome, Firefox ou Edge (versões recentes)

## 🚀 Tecnologias Utilizadas

### Backend
- **Laravel**: 12.0
- **PHP**: 8.2
- **MySQL**: Via XAMPP
- **Laravel Sanctum**: 4.2 (Autenticação API)
- **Laravel Fortify**: 1.30 (Autenticação)
- **Google2FA**: 8.0 (Autenticação 2FA)
- **Bacon QR Code**: 3.0 (Geração de QR Codes)

### Frontend
- **React**: 18.2.0
- **TypeScript**: 5.8.3
- **Vite**: 7.1.2
- **React Router DOM**: 6.20.0
- **Axios**: 1.11.0
- **GovBR DS React Components**: 2.1.0

## 📦 Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/Jeniffrr/TCC-Magnolia.git
cd tcc
```

### 2. Configurar o XAMPP

1. Baixe e instale o [XAMPP](https://www.apachefriends.org/)
2. Inicie o **Apache** e o **MySQL** pelo painel do XAMPP
3. Acesse `http://localhost/phpmyadmin`
4. Crie um banco de dados chamado `hospital_db`

### 3. Configurar o Backend (Laravel)

```bash
cd api

# Instalar dependências do Composer
composer install

# Copiar arquivo de ambiente
copy .env.example .env

# Gerar chave da aplicação
php artisan key:generate

# Configurar o arquivo .env com as credenciais do banco
```

**Edite o arquivo `.env`:**

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hospital_db
DB_USERNAME=root
DB_PASSWORD=

APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

**Executar migrations e seeders:**

```bash
# Criar tabelas no banco de dados
php artisan migrate

# Popular dados iniciais
php artisan db:seed
```

**Iniciar o servidor Laravel:**

```bash
php artisan serve
```

O backend estará rodando em `http://localhost:8000`

### 4. Configurar o Frontend (React)

Abra um novo terminal:

```bash
cd spa

# Instalar dependências do NPM
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## ⚙️ Configuração

### Usuário Administrador Padrão

Após executar os seeders, você terá um usuário administrador:

- **Email**: `j@gmail.com`
- **Senha**: `12345678`
- **Tipo**: Administrador

### Configuração do 2FA

No primeiro login, o sistema solicitará a configuração do 2FA:

1. Instale um aplicativo autenticador (Google Authenticator, Authy, etc.)
2. Escaneie o QR Code apresentado
3. Digite o código de 6 dígitos gerado

## 📖 Como Usar

### Fluxo de Trabalho

#### 1. Login no Sistema

1. Acesse `http://localhost:5173`
2. Faça login com suas credenciais
3. Configure o 2FA (primeira vez)
4. Digite o código 2FA

#### 2. Para Administradores

**Gerenciar Usuários:**
- Cadastrar novos profissionais (médicos, enfermeiros, técnicos)
- Editar dados de usuários
- Ativar/Desativar usuários
- Visualizar lista de profissionais

**Gerenciar Leitos:**
- Cadastrar novos leitos
- Editar informações dos leitos
- Visualizar disponibilidade
- Remover leitos

#### 3. Para Profissionais de Saúde

**Gerenciar Pacientes:**

1. **Cadastrar Nova Paciente:**
   - Clique em "Cadastrar Paciente"
   - Preencha dados pessoais (nome, CPF, data de nascimento, nome da mãe)
   - Preencha endereço completo
   - Adicione histórico médico (alergias, medicamentos, condições patológicas)
   - Adicione gestações anteriores (se houver)
   - Selecione o leito
   - Preencha dados da internação (motivo, sinais vitais, avaliação fetal)
   - Aceite o consentimento LGPD
   - Clique em "Cadastrar Paciente"

2. **Visualizar Pacientes:**
   - Acesse "Gerenciar Pacientes"
   - Veja a lista de pacientes internadas
   - Clique no ícone de olho para ver detalhes

3. **Editar Paciente:**
   - Na lista de pacientes, clique no ícone de edição
   - Atualize as informações necessárias
   - Salve as alterações

**Atendimentos:**

1. **Registrar Novo Atendimento:**
   - Acesse "Pagina Inicial"
   - Selecione a paciente
   - Clique em "Novo Atendimento"
   - Preencha sinais vitais
   - Adicione evolução da maternidade
   - Registre avaliação fetal
   - Adicione exames, medicações e procedimentos (se necessário)
   - Salve o atendimento

2. **Visualizar Histórico:**
   - Selecione a paciente
   - Clique em "Ver Histórico Completo"
   - Visualize todos os atendimentos anteriores

3. **Registrar desfecho clínico:**
   - Selecione a paciente
   - Clique em "Registrar Desfecho"
   - Preencha detalhes do desfecho
   - Salve o desfecho

4. **Dar Alta:**
   - Selecione a paciente
   - Clique em "Dar Alta"
   - Preencha o motivo da alta
   - Adicione observações
   - Confirme a alta

## 🎯 Funcionalidades

### Módulo de Autenticação
- ✅ Login com email e senha
- ✅ Autenticação 2FA obrigatória
- ✅ Geração de QR Code para 2FA
- ✅ Controle de sessão
- ✅ Logout

### Módulo de Usuários (Admin)
- ✅ Cadastro de profissionais
- ✅ Edição de dados
- ✅ Ativação/Desativação
- ✅ Exclusão de usuários
- ✅ Listagem paginada
- ✅ Validação de CPF e email únicos

### Módulo de Leitos (Admin)
- ✅ Cadastro de leitos
- ✅ Edição de informações
- ✅ Visualização de disponibilidade
- ✅ Exclusão de leitos
- ✅ Listagem paginada

### Módulo de Pacientes
- ✅ Cadastro completo de pacientes
- ✅ Histórico médico completo
- ✅ Gestações anteriores
- ✅ Condições patológicas
- ✅ Edição de dados
- ✅ Visualização detalhada
- ✅ Consentimento LGPD

### Módulo de Internações
- ✅ Registro de internação
- ✅ Vinculação com leito
- ✅ Motivo da internação
- ✅ Status (ativa/finalizada)
- ✅ Data de entrada e saída

### Módulo de Atendimentos
- ✅ Registro de atendimentos
- ✅ Sinais vitais completos
- ✅ Evolução da maternidade
- ✅ Avaliação fetal (BCF, movimentos, altura uterina)
- ✅ Cálculo automático de categoria de risco
- ✅ Histórico completo de atendimentos
- ✅ Exames laboratoriais
- ✅ Medicações administradas
- ✅ Procedimentos realizados
- ✅ Ocorrências clínicas

### Módulo de Alta
- ✅ Registro de desfecho da internação
- ✅ Motivo da alta
- ✅ Observações
- ✅ Data e hora da alta
- ✅ Liberação do leito

### Sistema de Auditoria
- ✅ Log de visualizações
- ✅ Log de edições
- ✅ Rastreamento de ações
- ✅ Identificação do usuário responsável

## 📁 Estrutura do Projeto

```
tcc/
├── api/                          # Backend Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/      # Controladores da API
│   │   │   └── Traits/           # Traits reutilizáveis
│   │   └── Models/               # Modelos Eloquent
│   ├── database/
│   │   ├── migrations/           # Migrations do banco
│   │   └── seeders/              # Seeders de dados iniciais
│   ├── routes/
│   │   └── api.php               # Rotas da API
│   └── .env                      # Configurações do ambiente
│
├── spa/                          # Frontend React
│   ├── src/
│   │   ├── api/                  # Configuração do Axios
│   │   ├── components/           # Componentes reutilizáveis
│   │   ├── pages/                # Páginas da aplicação
│   │   │   ├── Admin/            # Páginas do administrador
│   │   │   └── Profissionais/    # Páginas dos profissionais
│   │   ├── routes/               # Configuração de rotas
│   │   ├── utils/                # Utilitários (máscaras, validações)
│   │   └── types/                # Tipos TypeScript
│   └── package.json              # Dependências do frontend
│
└── README.md                     # Este arquivo
```

## 🗄️ Estrutura do Banco de Dados

### Principais Tabelas

- **usuarios**: Profissionais do hospital
- **pacientes**: Dados das pacientes
- **leitos**: Leitos disponíveis
- **internacoes**: Internações ativas e finalizadas
- **atendimentos**: Atendimentos realizados
- **categoria_riscos**: Categorias de risco (Normal, Médio, Alto, Aborto)
- **condicao_patologicas**: Condições patológicas pré-existentes
- **gestacoes_anteriores**: Histórico de gestações
- **exames_laboratoriais**: Exames realizados
- **medicacoes_administradas**: Medicações aplicadas
- **procedimentos_realizados**: Procedimentos executados
- **ocorrencias_clinicas**: Ocorrências durante internação
- **desfechos_internacao**: Registro de altas
- **logs_auditoria**: Auditoria de ações

## 🔒 Segurança

- Autenticação 2FA obrigatória
- Tokens JWT via Laravel Sanctum
- Validação de dados no backend e frontend
- Proteção contra CSRF
- Consentimento LGPD
- Auditoria de ações sensíveis
- Controle de acesso por tipo de usuário

## 🐛 Solução de Problemas

### Erro de conexão com o banco de dados
- Verifique se o MySQL está rodando no XAMPP
- Confirme as credenciais no arquivo `.env`
- Certifique-se de que o banco `hospital_db` foi criado

### Erro 404 nas rotas da API
- Verifique se o servidor Laravel está rodando (`php artisan serve`)
- Confirme a URL da API no frontend (`http://localhost:8000`)

### Erro de CORS
- Verifique a configuração de CORS no Laravel (`config/cors.php`)
- Confirme que `FRONTEND_URL` está correto no `.env`

### Erro ao instalar dependências
- Limpe o cache: `composer clear-cache` ou `npm cache clean --force`
- Delete as pastas `vendor` ou `node_modules` e reinstale

## 📝 Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC).

## 👥 Autores

**Desenvolvido por:** [Jeniffer Santana]  
**Orientador:** [Mario Lemes]  
**Instituição:** [Instituto Federal de Goias]  
**Ano:** 2024/2025


## 👥 Suporte

Para dúvidas ou problemas, entre em contato.
