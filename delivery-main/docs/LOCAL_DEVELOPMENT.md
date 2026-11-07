# 🚀 Guia de Desenvolvimento Local

Este guia ajudará você a configurar o ambiente de desenvolvimento local do projeto.

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) 18+ 
- [pnpm](https://pnpm.io/) 8+
- [Docker](https://www.docker.com/) e Docker Compose
- [Git](https://git-scm.com/)

## 🐳 1. Configurar PostgreSQL com Docker

### Iniciar o banco de dados

```bash
# Iniciar apenas o PostgreSQL em background
docker compose up -d postgres

# Verificar se está rodando
docker-compose ps

# Ver logs (opcional)
docker-compose logs -f postgres
```

### Parar o banco de dados

```bash
# Parar os containers
docker-compose down

# Parar e remover volumes (apaga dados)
docker-compose down -v
```

## 📦 2. Instalar Dependências

```bash
pnpm install
```

## 🔧 3. Configurar Variáveis de Ambiente

```bash
# Copiar o exemplo de configuração local
cp .env.local.example .env.local

# Ou criar manualmente com as seguintes variáveis:
cat > .env.local << 'EOF'
POSTGRES_PRISMA_URL="postgresql://delivery:delivery123@localhost:5432/delivery_db"
POSTGRES_URL_NON_POOLED="postgresql://delivery:delivery123@localhost:5432/delivery_db"
DATABASE_URL="postgresql://delivery:delivery123@localhost:5432/delivery_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-dev-secret-change-in-production"
JWT_SECRET="local-jwt-secret-change-in-production"
JWT_EXPIRES_IN="7d"
ADMIN_SECRET="admin-secret-for-local-dev"
EOF
```

## 🗄️ 4. Configurar o Banco de Dados

```bash
# Gerar o Prisma Client
pnpm prisma generate

# Executar as migrations
pnpm prisma migrate deploy

# OU usar migrate dev (cria migration se houver mudanças)
pnpm prisma migrate dev

# Popular o banco com dados iniciais (sabores e adicionais)
pnpm prisma db seed
```

## 👤 5. Criar Usuário Admin

```bash
# Criar um usuário administrador
pnpm tsx scripts/create-admin.ts
```

Será solicitado:
- Email
- Nome
- Senha

## ▶️ 6. Iniciar o Servidor de Desenvolvimento

```bash
pnpm dev
```

Acesse: http://localhost:3000

Esse fluxo é para desenvolvimento HTTP. Para executar a aplicação local completa com HTTPS e certificado gerado por você via OpenSSL, siga a seção **HTTPS local com sua chave OpenSSL** em [DEPLOY.md](../DEPLOY.md).

## 🛠️ Comandos Úteis

### Prisma

```bash
# Abrir Prisma Studio (UI para visualizar dados)
pnpm prisma studio

# Resetar banco de dados (CUIDADO: apaga tudo)
pnpm prisma migrate reset

# Ver status das migrations
pnpm prisma migrate status

# Formatar schema.prisma
pnpm prisma format
```

### Docker

```bash
# Acessar o PostgreSQL via CLI
docker exec -it delivery-postgres psql -U delivery -d delivery_db

# Backup do banco
docker exec delivery-postgres pg_dump -U delivery delivery_db > backup.sql

# Restaurar backup
docker exec -i delivery-postgres psql -U delivery delivery_db < backup.sql

# Ver uso de recursos
docker stats delivery-postgres
```

### Next.js

```bash
# Build de produção local
pnpm build

# Iniciar servidor de produção
pnpm start

# Linting
pnpm lint

# Testes
pnpm test
```

## 🔍 Verificação de Ambiente

Após configurar tudo, verifique se está funcionando:

1. ✅ Docker container rodando: `docker-compose ps`
2. ✅ Banco criado: `pnpm prisma studio`
3. ✅ Dados seedados: Verificar tabelas Sabor e Adicional no Prisma Studio
4. ✅ Servidor Next.js rodando: http://localhost:3000

## 🐛 Troubleshooting

### Erro: "Can't reach database server"

```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps

# Reiniciar o container
docker-compose restart postgres
```

### Erro: "Port 5432 already in use"

Você tem outro PostgreSQL rodando. Opções:

1. Parar o PostgreSQL local:
   ```bash
   sudo systemctl stop postgresql
   ```

2. Ou mudar a porta no `docker-compose.yml`:
   ```yaml
   ports:
     - "5433:5432"  # Use porta 5433 no host
   ```
   E atualizar a `DATABASE_URL` em `.env.local`:
   ```
   DATABASE_URL="postgresql://delivery:delivery123@localhost:5433/delivery_db"
   ```

### Erro: "Schema does not exist"

```bash
# Aplicar as migrations novamente
pnpm prisma migrate deploy

# Ou resetar completamente
pnpm prisma migrate reset
```

### Dados não aparecem após seed

```bash
# Rodar seed manualmente com mais verbose
pnpm prisma db seed

# Verificar no Prisma Studio
pnpm prisma studio
```

## 📁 Estrutura do Projeto

```
delivery/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Componentes React
│   ├── core/            # Domain Layer (DDD)
│   ├── infrastructure/  # Infrastructure Layer
│   └── lib/             # Utilitários e configs
├── prisma/
│   ├── schema.prisma    # Schema do banco
│   ├── seed.ts          # Script de seed
│   └── migrations/      # Histórico de migrations
├── data/                # JSONs com dados iniciais
├── docs/                # Documentação
└── docker-compose.yml   # Config do PostgreSQL
```

## 🔗 Próximos Passos

- [Deploy no Vercel](./DEPLOYMENT.md)
- [Arquitetura do Projeto](./ARCHITECTURE.md)
- [Guia de Contribuição](./CONTRIBUTING.md)
- [API Reference](./API.md)
