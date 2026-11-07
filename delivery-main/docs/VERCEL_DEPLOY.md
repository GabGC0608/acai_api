# 🚀 Deploy na Vercel - Guia Completo

Este guia explica como fazer deploy da aplicação de delivery na Vercel.

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Repositório Git (GitHub, GitLab ou Bitbucket)
3. Banco de dados PostgreSQL (Vercel Postgres ou outro provider)

## 🗄️ Configuração do Banco de Dados

### Opção 1: Vercel Postgres (Recomendado)

1. **Criar Banco de Dados:**
   - Acesse seu projeto na Vercel
   - Vá em "Storage" → "Create Database"
   - Selecione "Postgres"
   - Escolha a região mais próxima dos seus usuários
   - Aguarde a criação

2. **Conectar ao Projeto:**
   - A Vercel automaticamente adiciona a variável `POSTGRES_URL`
   - Você pode renomeá-la para `DATABASE_URL` nas configurações

3. **Verificar Variáveis:**
   ```bash
   DATABASE_URL="postgres://..."
   ```

### Opção 2: Neon, Supabase ou outro PostgreSQL

1. **Criar banco de dados no provider escolhido**
2. **Copiar a connection string**
3. **Adicionar como variável de ambiente na Vercel**

## 🔧 Configuração na Vercel

### 1. Importar Projeto

```bash
# Via CLI (opcional)
npm i -g vercel
vercel login
vercel
```

Ou via Dashboard:
1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe seu repositório Git
3. Selecione o framework: **Next.js**
4. Configure as variáveis de ambiente

### 2. Variáveis de Ambiente

Configure as seguintes variáveis em **Settings → Environment Variables**:

```bash
# Database (OBRIGATÓRIO)
DATABASE_URL=postgresql://user:pass@host:5432/db

# NextAuth (OBRIGATÓRIO)
NEXTAUTH_URL=https://acai-api.vercel.app
NEXTAUTH_SECRET=generate-com-openssl-rand-base64-32

# JWT (OBRIGATÓRIO)
JWT_SECRET=outro-secret-diferente-do-nextauth

# Opcional - Google OAuth
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret

# Node Environment
NODE_ENV=production
```

Configure `NEXTAUTH_URL` em **Settings → Environment Variables** nos ambientes de produção e faça novo deploy. A Vercel provisiona e renova automaticamente HTTPS para o domínio `acai-api.vercel.app`; não é necessário gerar ou enviar chaves TLS OpenSSL. O projeto também envia HSTS e outros cabeçalhos de segurança.

**⚠️ IMPORTANTE:** Gere secrets seguros:
```bash
openssl rand -base64 32  # Para NEXTAUTH_SECRET
openssl rand -base64 32  # Para JWT_SECRET
```

### 3. Build Settings

A Vercel detecta automaticamente, mas confirme:

```json
{
  "buildCommand": "prisma generate && next build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "devCommand": "next dev"
}
```

## 🚀 Deploy

### Deploy Automático (Recomendado)

1. **Push para o repositório:**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **A Vercel faz deploy automaticamente!**
   - Cada push na branch `main` gera um deploy de produção
   - PRs geram preview deployments

### Deploy Manual (CLI)

```bash
vercel --prod
```

## 📦 Migrations no Deploy

O script de build já executa as migrations:

```json
"build": "prisma generate && prisma migrate deploy && next build"
```

**Como funciona:**
1. `prisma generate` - gera o Prisma Client
2. `prisma migrate deploy` - aplica migrations pendentes
3. `next build` - builda o Next.js

## 🌱 Seed do Banco de Dados

Para popular o banco pela primeira vez:

### Opção 1: Via Vercel CLI

```bash
# Conectar ao projeto
vercel link

# Executar seed
vercel env pull .env.production
pnpm prisma db seed
```

### Opção 2: Endpoint existente (temporário)

A rota `/api/seed` popula sabores e adicionais e exige `ADMIN_SECRET` configurado. Ela não cria administrador nem retorna senhas. Após uso, remova ou desabilite o endpoint e não coloque o segredo em código ou repositório.

**⚠️ Remover o endpoint após usar!**

## 👤 Criar Usuário Admin

### Opção 1: Direto no Banco

Se usar Vercel Postgres:
```sql
-- Via Vercel Dashboard > Storage > Query
INSERT INTO "Cliente" (email, nome, senha, "isAdmin")
VALUES (
  'admin@delivery.com',
  'Admin',
  '$2a$10$...',  -- hash bcrypt da senha
  true
);
```

### Opção 2: Via Endpoint Temporário

Criar `src/app/api/create-admin/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { secret, email, password, name } = await request.json();
  
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const admin = await prisma.cliente.create({
    data: {
      email,
      nome: name,
      senha: hashedPassword,
      isAdmin: true,
    },
  });

  return NextResponse.json({ id: admin.id, email: admin.email });
}
```

Fazer request:
```bash
curl -X POST https://seu-app.vercel.app/api/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "seu-admin-secret",
    "email": "admin@delivery.com",
    "password": "senha-forte",
    "name": "Admin"
  }'
```

**⚠️ Remover o endpoint após criar o admin!**

## 🔍 Verificação Pós-Deploy

### 1. Verificar Build
- Acesse o dashboard da Vercel
- Veja os logs de build
- Confirme que não há erros

### 2. Testar Funcionalidades
- ✅ Página inicial carrega
- ✅ Login funciona
- ✅ Registro funciona
- ✅ Criação de pedidos funciona
- ✅ Admin consegue acessar dashboard

### 3. Verificar Banco de Dados
```bash
# Via Vercel Postgres Dashboard
SELECT * FROM "Cliente" LIMIT 5;
SELECT * FROM "Pedido" LIMIT 5;
```

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
**Solução:**
- Verificar `DATABASE_URL` nas env vars
- Confirmar que o banco PostgreSQL está acessível
- Verificar allowlist de IPs (Vercel usa IPs dinâmicos)

### Erro: "Prisma Client not generated"
**Solução:**
```json
"build": "prisma generate && next build"
```

### Erro: "Table doesn't exist"
**Solução:**
- Executar migrations: `prisma migrate deploy`
- Verificar se migrations estão no repositório

### Erro: "Cannot find module @prisma/client"
**Solução:**
- Adicionar `postinstall` script:
```json
"postinstall": "prisma generate"
```

### Sessões não funcionam
**Solução:**
- Verificar `NEXTAUTH_SECRET` está definido
- Confirmar `NEXTAUTH_URL` está correto
- Verificar cookies no browser (deve aceitar third-party cookies)

## 📊 Monitoramento

### Logs em Tempo Real
```bash
vercel logs --follow
```

### Analytics
- Acesse "Analytics" no dashboard da Vercel
- Veja métricas de performance
- Monitore erros

### Alertas
Configure webhooks para receber notificações:
- Deploy failures
- Runtime errors
- Performance issues

## 🔄 Rollback

Se algo der errado:

1. **Via Dashboard:**
   - Vá em "Deployments"
   - Selecione deploy anterior
   - Clique em "Promote to Production"

2. **Via CLI:**
   ```bash
   vercel rollback
   ```

## 🚦 Domínio Customizado

1. **Adicionar Domínio:**
   - Settings → Domains
   - Adicionar seu domínio
   - Seguir instruções de DNS

2. **Configurar DNS:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Atualizar NEXTAUTH_URL:**
   ```bash
   NEXTAUTH_URL=https://acai-api.vercel.app
   ```

## 📝 Checklist Final

- [ ] Banco PostgreSQL configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Migrations aplicadas
- [ ] Seed executado
- [ ] Admin criado
- [ ] Build passou sem erros
- [ ] Site acessível
- [ ] Login funcionando
- [ ] Pedidos funcionando
- [ ] Admin dashboard funcionando
- [ ] Domínio configurado (opcional)

## 🎉 Deploy Completo!

Sua aplicação está no ar! 🚀

**URLs importantes:**
- Produção: `https://seu-app.vercel.app`
- Dashboard: `https://vercel.com/seu-usuario/seu-app`
- Logs: `vercel logs`

---

**Suporte:**
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
