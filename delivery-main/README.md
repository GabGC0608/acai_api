# 🍦 Açai do Vale - Sistema de Pedidos

Sistema de delivery desenvolvido com **Next.js 15**, **Prisma ORM**, **PostgreSQL** e **TypeScript**, seguindo princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**.

## 🚀 Executar e demonstrar localmente

O modo recomendado para a apresentação é o ambiente Docker Compose completo. Ele inicia o PostgreSQL, a aplicação Next.js e o proxy Nginx que separa páginas HTTP públicas das rotas HTTPS sensíveis. Não use `pnpm dev` para demonstrar a exigência de HTTPS seletivo: esse comando inicia apenas o servidor de desenvolvimento e não sobe o proxy TLS.

### Pré-requisitos

- Git;
- Docker Desktop (Windows/macOS) ou Docker Engine com o plugin Docker Compose (Linux), iniciado antes dos comandos;
- OpenSSL 1.1.1 ou superior;
- navegador atualizado.

O Docker Compose publica as portas **80** e **443** apenas na interface local (`127.0.0.1`). Se essas portas já estiverem ocupadas, pare o outro serviço antes de iniciar. O banco é criado e migrado pelo próprio container da aplicação.

### 1. Obter o projeto

Clone o repositório e entre na pasta que contém este README e o `docker-compose.yml`:

```bash
git clone https://github.com/GabGC0608/acai_api.git
cd acai_api/delivery-main
```

Se o projeto já estiver no computador, abra um terminal nessa pasta. Confirme que `docker-compose.yml`, `nginx/default.conf` e `package.json` estão no diretório atual.

### 2. Gerar o certificado local com OpenSSL

Crie a pasta `certs` e gere uma chave RSA, um CSR e o certificado autoassinado para `localhost`. Os arquivos são ignorados pelo Git; nunca compartilhe `private.key`.

**Windows PowerShell** (o bloco tenta primeiro o OpenSSL do PATH e depois o instalado com Git for Windows):

```powershell
New-Item -ItemType Directory -Force certs | Out-Null
$openssl = (Get-Command openssl -ErrorAction SilentlyContinue).Source
if (-not $openssl) { $openssl = "$env:ProgramFiles\Git\usr\bin\openssl.exe" }
if (-not (Test-Path $openssl)) { throw "OpenSSL não encontrado. Instale OpenSSL ou Git for Windows." }
& $openssl genpkey -algorithm RSA -out certs/private.key -pkeyopt rsa_keygen_bits:2048
& $openssl req -new -key certs/private.key -out certs/request.csr -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
& $openssl x509 -req -in certs/request.csr -signkey certs/private.key -out certs/server.crt -days 365 -copy_extensions copy
```

**macOS/Linux:**

```bash
mkdir -p certs
openssl genpkey -algorithm RSA -out certs/private.key -pkeyopt rsa_keygen_bits:2048
openssl req -new -key certs/private.key -out certs/request.csr \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
openssl x509 -req -in certs/request.csr -signkey certs/private.key \
  -out certs/server.crt -days 365 -copy_extensions copy
```

Os arquivos gerados têm estas funções:

- `private.key`: chave privada do servidor, mantida em segredo;
- `request.csr`: solicitação de certificado que inclui a chave pública e a identificação de `localhost`;
- `server.crt`: certificado TLS usado pelo Nginx, autoassinado para a demonstração local.

Como o certificado não foi emitido por uma autoridade certificadora reconhecida, o navegador pode mostrar um aviso ao abrir HTTPS. Isso é esperado no ambiente local. Não use este certificado em um site público nem insira credenciais se não estiver demonstrando no computador controlado pelo grupo.

### 3. Iniciar a aplicação e o proxy

Na raiz do projeto, execute:

```bash
docker compose up -d --build
```

Na primeira execução o Docker baixa imagens, constrói a aplicação, aguarda o PostgreSQL, gera o cliente Prisma e aplica as migrations. Pode levar alguns minutos. Acompanhe a inicialização com:

```bash
docker compose ps
docker compose logs -f web https-proxy
```

Quando os containers estiverem ativos, acesse **http://localhost**. Para parar a saída contínua de logs, use `Ctrl+C`; isso não para os containers.

### 4. Demonstrar HTTP e HTTPS seletivos

1. Abra **http://localhost**. Mostre a página institucional e a seção **Política de Segurança**. Essa página pública deve permanecer em HTTP.
2. Clique em **Entrar**, **Fazer Pedido**, **Começar Agora** ou **Acessar login seguro**. O navegador deve ir para **https://localhost** antes de abrir login, cadastro ou o fluxo de pedido.
3. Se aparecer aviso sobre certificado autoassinado, explique que o certificado foi gerado localmente com OpenSSL e que não tem cadeia de confiança de uma CA pública. Para a demonstração local, prossiga apenas no ambiente controlado do trabalho.
4. Como demonstração adicional, digite **http://localhost/login**. O Nginx deve responder com redirecionamento para **https://localhost/login** antes de enviar a rota sensível para o Next.js.
5. Mostre no navegador o cadeado/indicador de HTTPS e, se desejar, use as ferramentas de desenvolvedor na aba Network para observar a troca de protocolo e as chamadas às APIs sob HTTPS.
6. Mostre `nginx/default.conf`, `docker-compose.yml` e esta seção do README para explicar como Nginx escolhe o protocolo, onde o certificado é montado e como reproduzir a demonstração.

As rotas de login, cadastro, conta, administração, APIs e etapas do pedido passam pelo proxy HTTPS. Isso inclui a jornada do pedido porque ela consulta APIs e pode enviar dados de cliente, endereço e pedido. A página institucional e rotas públicas fora dessas categorias continuam disponíveis em HTTP.

### 5. Verificar certificado e rotas pelo terminal (opcional)

No macOS/Linux, `curl` pode validar o certificado autoassinado fornecendo-o explicitamente:

```bash
curl --cacert certs/server.crt https://localhost/login -I
curl -I http://localhost/login
curl -I http://localhost/
```

No Windows PowerShell, use `curl.exe` para evitar o alias histórico do PowerShell:

```powershell
curl.exe --cacert certs/server.crt -I https://localhost/login
curl.exe -I http://localhost/login
curl.exe -I http://localhost/
```

A rota sensível HTTP deve retornar um redirecionamento `301` com destino HTTPS. A página inicial HTTP deve ser atendida sem redirecionamento para HTTPS. Para verificar o certificado e os nomes cobertos:

```bash
openssl x509 -in certs/server.crt -noout -subject -issuer -dates -ext subjectAltName
```

### Encerrar e reiniciar

Parar os containers mantendo os dados do banco:

```bash
docker compose down
```

Iniciar novamente depois que os certificados já existirem:

```bash
docker compose up -d
```

Para apagar também os dados persistidos do PostgreSQL (ação irreversível para os dados locais):

```bash
docker compose down -v
```

### Problemas comuns

- **Erro dizendo que `certs/server.crt` ou `certs/private.key` não existe:** gere os arquivos da etapa 2 no diretório raiz do projeto.
- **Porta 80 ou 443 já está em uso:** encerre o outro servidor/aplicativo que ocupa a porta e rode `docker compose up -d` novamente.
- **O HTTPS mostra aviso de certificado:** esperado para certificado autoassinado. Confirme que abriu `localhost` no ambiente local da apresentação.
- **A página não abre logo após iniciar:** veja `docker compose ps` e `docker compose logs -f web https-proxy`; aguarde o banco ficar saudável e as migrations terminarem.
- **Quer reconstruir após alteração de código/configuração:** rode `docker compose up -d --build`.
- **Não use `localhost:3000` para demonstrar a separação:** essa porta acessa diretamente o Next.js e contorna as regras do Nginx nas portas 80/443.

O tutorial de OpenSSL solicitado pelo enunciado também deve ser entregue separadamente pelo grupo no Classroom. As instruções acima são para executar e demonstrar o sistema localmente.

## 📚 Documentação Completa

Toda a documentação está organizada na pasta `/docs`:

- **[🚀 Setup Local Completo](./docs/LOCAL_DEVELOPMENT.md)** - Guia detalhado de desenvolvimento local
- **[🌐 Deploy no Vercel](./docs/DEPLOYMENT.md)** - Deploy em produção com Neon PostgreSQL
- **[🏗️ Arquitetura](./docs/ARCHITECTURE.md)** - Clean Architecture, DDD e padrões de design
- **[📖 Índice Completo](./docs/INDEX.md)** - Todos os documentos disponíveis

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
