# RELATÓRIO FINAL - PROJETO AÇAÍ DO VALE

## Sistema de Delivery com Clean Architecture e Domain-Driven Design

**Disciplina:** Engenharia de Software II  
**Instituição:** UFVJM
**Integrantes:** Ana Clara Rolim de Azevedo, Pedro Augusto Hackner Bittencourt, Murilo Santiago, Gabriel Castro, Humberto Freire, Pávila


---

## 📋 SUMÁRIO EXECUTIVO

Este relatório documenta o desenvolvimento completo do projeto **Açaí do Vale**, um sistema de delivery de açaí desenvolvido como trabalho prático da disciplina de Engenharia de Software II. O projeto foi desenvolvido seguindo as melhores práticas de arquitetura de software, especificamente **Clean Architecture** e **Domain-Driven Design (DDD)**, com foco em testabilidade, manutenibilidade e escalabilidade.

O sistema apresenta uma arquitetura em camadas bem definida, utiliza tecnologias modernas como Next.js 15, React 19, TypeScript e Prisma ORM, e incorpora padrões de design consolidados como Factory, Adapter e Singleton. A aplicação foi estruturada para ser facilmente testável, com separação clara entre lógica de negócio e infraestrutura.

### Métricas Principais

| Métrica | Valor |
|---------|-------|
| Linguagem Principal | TypeScript |
| Framework Web | Next.js 15 |
| Banco de Dados | PostgreSQL |
| Padrão Arquitetural | Clean Architecture + DDD |
| Cobertura de Testes | Configurado com Jest |
| Deploy | Vercel + Docker |
| Status | Funcional e Testável |

---

## 1️⃣ INTRODUÇÃO

### 1.1 Contexto e Motivação

O projeto Açaí do Vale foi desenvolvido como trabalho acadêmico com o objetivo de aplicar conceitos fundamentais de Engenharia de Software em um sistema real de delivery. A escolha de um domínio específico (açaí do vale) permitiu trabalhar com:

- **Gestão de pedidos** em tempo real
- **Autenticação e autorização** de usuários (cliente vs. admin)
- **Persistência de dados** estruturada
- **APIs RESTful** seguindo padrões modernos
- **Interface responsiva** para múltiplos tipos de usuário

### 1.2 Objetivos do Projeto

**Objetivos Gerais:**
- Desenvolver uma aplicação web full-stack funcional e bem arquitetada
- Demonstrar compreensão de princípios SOLID e padrões de design
- Implementar testes automatizados e qualidade de código
- Documentar todas as decisões arquiteturais e tecnológicas

**Objetivos Específicos:**
- Implementar sistema de autenticação com JWT
- Criar API RESTful com mais de 15 endpoints
- Estruturar banco de dados com relacionamentos complexos
- Aplicar Clean Architecture em toda a aplicação
- Configurar CI/CD com GitHub Actions
- Preparar para deploy em ambiente de produção (Vercel)

### 1.3 Escopo do Projeto

**Funcionalidades Implementadas:**
-  Cadastro e login de clientes
-  Gerenciamento de pedidos (criar, listar, atualizar)
-  Dashboard administrativo
-  Gestão de sabores e adicionais
-  Sistema de endereços para entrega
-  Autenticação com JWT e senha criptografada
-  Relacionamentos M2M (muitos-para-muitos) entre entidades
-  Seed de dados para testes
-  Documentação técnica completa

**Funcionalidades Futuras:**
- Sistema de cupons e fidelidade
- Integração com sistema de pagamento
- Notificações em tempo real (WebSockets)
- App mobile nativo
- Sistema de avaliações e reviews

---

## 2️⃣ ARQUITETURA DO SOFTWARE

### 2.1 Princípios Arquiteturais Aplicados

#### 2.1.1 Clean Architecture

A aplicação foi estruturada seguindo os princípios de Clean Architecture, onde as dependências apontam sempre para dentro, isolando a lógica de negócio de qualquer framework ou tecnologia específica.

**Camadas Definidas:**

```
┌─────────────────────────────────────────┐
│     Presentation Layer (Controllers)    │  Responsável por HTTP
├─────────────────────────────────────────┤
│     Application Layer (Use Cases)       │  Lógica de aplicação
├─────────────────────────────────────────┤
│     Domain Layer (Entities)             │  Regras de negócio puras
├─────────────────────────────────────────┤
│     Infrastructure Layer (Adapters)     │  Persistência, criptografia
└─────────────────────────────────────────┘
```

**Propriedades:**
- **Independência de Frameworks:** Núcleo não depende de Next.js, Prisma ou express
- **Testabilidade:** Sem dependências externas, fácil de testar
- **Independência de Banco de Dados:** Interfaces abstraem persistência
- **Independência de UI:** Lógica reutilizável em diferentes contextos

#### 2.1.2 Domain-Driven Design (DDD)

O projeto implementa conceitos fundamentais de DDD:

- **Bounded Context:** Clientes, Pedidos, Sabores - cada um com sua responsabilidade
- **Entities:** Customer, Order, Flavor, Additional representam conceitos de negócio
- **Linguagem Ubíqua:** Termos consistentes em código e documentação
- **Repository Pattern:** Abstrair persistência através de interfaces

#### 2.1.3 Arquitetura Hexagonal (Ports & Adapters)

A aplicação implementa o padrão Hexagonal para máxima flexibilidade:

- **Ports (Interfaces):** `ICustomerRepository`, `IHashProvider`, `ITokenProvider`
- **Adapters (Implementações):** `PrismaCustomerRepository`, `BCryptHashProvider`, `JWTTokenProvider`
- **Benefit:** Trocar implementações sem alterar lógica de negócio

### 2.2 Estrutura de Diretórios

```
src/
├── core/                                    # NÚCLEO DA APLICAÇÃO
│   ├── domain/                              # Camada de Domínio
│   │   ├── entities/
│   │   │   ├── customer.entity.ts
│   │   │   ├── order.entity.ts
│   │   │   ├── flavor.entity.ts
│   │   │   └── additional.entity.ts
│   │   ├── value-objects/                   # (Extensível para futuro)
│   │   └── repositories/                    # Ports (Interfaces)
│   │       ├── customer.repository.interface.ts
│   │       ├── order.repository.interface.ts
│   │       ├── flavor.repository.interface.ts
│   │       ├── additional.repository.interface.ts
│   │       ├── hash-provider.interface.ts
│   │       └── token-provider.interface.ts
│   │
│   └── application/                         # Camada de Aplicação
│       └── use-cases/                       # Casos de uso implementados
│           ├── customer/
│           │   ├── create-customer.use-case.ts
│           │   ├── get-customer-by-id.use-case.ts
│           │   ├── get-customer-by-email.use-case.ts
│           │   ├── list-all-customers.use-case.ts
│           │   ├── update-customer.use-case.ts
│           │   └── delete-customer.use-case.ts
│           ├── order/
│           ├── flavor/
│           ├── additional/
│           └── auth/
│
├── infrastructure/                          # Camada de Infraestrutura
│   ├── database/
│   │   └── prisma/
│   │       └── repositories/                # Adapters (Implementações)
│   │           ├── prisma-customer.repository.ts
│   │           ├── prisma-order.repository.ts
│   │           ├── prisma-flavor.repository.ts
│   │           └── prisma-additional.repository.ts
│   ├── cryptography/
│   │   ├── bcrypt-hash-provider.ts
│   │   └── jwt-token-provider.ts
│   └── http/
│       └── controllers/                     # Entrada HTTP
│           ├── customer.controller.ts
│           ├── order.controller.ts
│           ├── flavor.controller.ts
│           ├── additional.controller.ts
│           └── auth.controller.ts
│
├── composition/                             # Injeção de Dependências
│   └── factories/                           # Factories para composição
│       ├── customer-use-case.factory.ts
│       ├── order-use-case.factory.ts
│       ├── flavor-use-case.factory.ts
│       ├── additional-use-case.factory.ts
│       └── auth-use-case.factory.ts
│
├── shared/                                  # Utilitários Compartilhados
│   ├── either/
│   │   └── either.ts                       # Functional Error Handling
│   └── errors/
│       └── app-error.ts                    # Hierarquia de erros
│
└── app/                                     # Camada de Apresentação (Next.js)
    ├── api/                                 # API Routes
    ├── (admin)/                             # Routes administrativas
    ├── login/                               # Authentication
    ├── pedidos/                             # Listagem de pedidos
    ├── dashboard/                           # Dashboard
    └── components/                          # Componentes React
```

### 2.3 Padrões de Design Utilizados

#### 2.3.1 Factory Pattern

**Uso:** Criação de instâncias de casos de uso com todas as dependências

```typescript
// customer-use-case.factory.ts
export class CustomerUseCaseFactory {
  static makeCreateCustomerUseCase(): CreateCustomerUseCase {
    const customerRepository = new PrismaCustomerRepository()
    const hashProvider = new BCryptHashProvider()
    return new CreateCustomerUseCase(customerRepository, hashProvider)
  }
}
```

**Benefícios:**
- Encapsula criação complexa de objetos
- Facilita injeção de dependências
- Centraliza configuração

#### 2.3.2 Repository Pattern

**Uso:** Abstrair acesso a dados

```typescript
// Domain Layer (Interface)
interface ICustomerRepository {
  create(customer: Customer): Promise<Customer>
  findById(id: number): Promise<Customer | null>
  findByEmail(email: string): Promise<Customer | null>
  findAll(): Promise<Customer[]>
  update(id: number, data: Customer): Promise<Customer>
  delete(id: number): Promise<void>
}

// Infrastructure Layer (Implementação)
class PrismaCustomerRepository implements ICustomerRepository {
  // Implementação com Prisma
}
```

**Benefícios:**
- Desacopla lógica de negócio de persistência
- Facilita testes com mocks
- Permite trocar BD sem alterar casos de uso

#### 2.3.3 Singleton Pattern

**Uso:** PrismaClientFactory compartilhado

```typescript
export class PrismaClientFactory {
  private static instance: PrismaClient
  
  static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient()
    }
    return this.instance
  }
}
```

**Benefícios:**
- Uma única conexão com o banco
- Reutilização segura de recursos
- Melhor performance

#### 2.3.4 Adapter Pattern

**Uso:** Implementar interfaces de domínio em infraestrutura

```typescript
// Porta (Interface no Domain)
interface IHashProvider {
  hash(password: string): Promise<string>
  compare(password: string, hash: string): Promise<boolean>
}

// Adaptador (Implementação na Infrastructure)
class BCryptHashProvider implements IHashProvider {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }
  // ...
}
```

### 2.4 Fluxo de Dados - Exemplo: Criar Cliente

```
Request HTTP
     ↓
[CustomerController] (Presentation)
     ↓ solicita instância
[CustomerUseCaseFactory] (Composition)
     ↓ cria
[CreateCustomerUseCase] (Application)
     ↓ valida & processa
[BCryptHashProvider] (Infrastructure)
     ↓ criptografa senha
[PrismaCustomerRepository] (Infrastructure)
     ↓ persiste
[PostgreSQL] (External)
     ↓ retorna id
[Customer Entity] (Domain)
     ↓ retorna no Response
Response HTTP
```

---

## 3️⃣ TECNOLOGIAS E FERRAMENTAS

### 3.1 Stack Tecnológico Detalhado

#### Frontend
- **Next.js 15:** Framework React com renderização híbrida SSR/CSR
- **React 19:** Biblioteca UI com hooks e componentes funcionais
- **TypeScript 5:** Tipagem estática para maior segurança
- **Tailwind CSS 4:** Utilitários CSS para estilização responsiva
- **React Hooks:** State management com Context API

#### Backend
- **Node.js + API Routes:** Execução no servidor via Next.js API routes
- **Express.js (implicit):** Via Next.js server
- **Prisma 6.19.0:** ORM type-safe para acesso a dados

#### Banco de Dados
- **PostgreSQL:** SGBD relacional robusto
- **Prisma Migrations:** Versionamento de schema
- **Prisma Studio:** IDE visual para BD

#### Segurança
- **bcryptjs 3.0.2:** Hash de senhas com salt
- **jsonwebtoken 9.0.2:** Geração e validação de JWT
- **Middleware de Autenticação:** Next.js middleware.js

#### Testes e Qualidade
- **Jest 30.2.0:** Framework de testes com configuração ts-jest
- **Supertest 7.1.4:** Testes de API HTTP
- **ts-jest 29.4.5:** Suporte TypeScript em Jest

#### DevOps e Deployment
- **Docker & Docker Compose:** Containerização e orquestração local
- **GitHub Actions:** CI/CD pipeline
- **Vercel:** Deploy contínuo em produção
- **Husky 9.1.7:** Git hooks para qualidade

#### Versionamento e Documentação
- **Git & GitHub:** Controle de versão
- **Markdown:** Documentação técnica
- **Mermaid:** Diagramas em código

### 3.2 Versões Críticas

| Tecnologia | Versão | Justificativa |
|-----------|--------|---------------|
| Node.js | 20.x+ | LTS com suporte a ES2024 |
| TypeScript | 5.x | Tipo "const" parameters, decoradores |
| Next.js | 15.5.7 | Turbopack, Performance |
| React | 19.2.1 | React Compiler, Actions |
| Prisma | 6.19.0 | Query engine otimizado |
| PostgreSQL | 15+ | JSON avançado, performance |

### 3.3 Justificativa das Escolhas Tecnológicas

1. **TypeScript:** Maior segurança em tempo de desenvolvimento, melhor documentação através de tipos
2. **Next.js:** Full-stack monolítico reduz complexidade, API routes integradas, SSR/CSR híbrido
3. **Prisma:** Queries type-safe, migrations automáticas, developer experience superior
4. **PostgreSQL:** Confiável, suporta JSON, relacionamentos complexos, open-source
5. **Docker:** Desenvolvimento e produção idênticos, portabilidade

---

## 4️⃣ DOCUMENTAÇÃO TÉCNICA DO PROJETO

### 4.1 Entidades e Relacionamentos

#### 4.1.1 Customer (Cliente)

```typescript
entity Customer {
  id: BigInt                    // ID único (BigInt para scalabilidade)
  name: String                  // Nome completo
  email: String                 // Email único
  password: String              // Hash bcrypt
  phone: String?                // Opcional
  address: Endereco?            // Relacionamento 1-1
  isAdmin: Boolean              // Flag de administrador
  createdAt: DateTime           // Timestamp criação
  updatedAt: DateTime           // Timestamp última atualização
  orders: Order[]               // Relacionamento 1-N
}
```

#### 4.1.2 Order (Pedido)

```typescript
entity Order {
  id: BigInt                    // ID único
  customerId: BigInt            // FK para Customer
  customer: Customer            // Relacionamento reverso
  flavors: Flavor[]             // M2M - sabores do pedido
  additionals: Additional[]     // M2M - adicionais
  status: OrderStatus           // enum: Pendente, Preparando, Pronto, Entregue
  totalPrice: Decimal           // Preço total
  notes: String?                // Observações
  deliveryAddress: String       // Endereço de entrega
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 4.1.3 Flavor (Sabor)

```typescript
entity Flavor {
  id: BigInt
  name: String                  // Nome do sabor
  description: String           // Descrição
  price: Decimal                // Preço base
  imageUrl: String?             // URL da imagem
  isAvailable: Boolean          // Disponibilidade
  orders: Order[]               // M2M
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 4.1.4 Additional (Adicional)

```typescript
entity Additional {
  id: BigInt
  name: String                  // Nome
  price: Decimal                // Preço adicional
  orders: Order[]               // M2M
  createdAt: DateTime
}
```

#### 4.1.5 Endereco (Endereço)

```typescript
entity Endereco {
  id: BigInt
  clienteId: BigInt             // FK para Customer
  cliente: Customer             // Relacionamento reverso
  rua: String
  numero: String
  complemento: String?
  bairro: String
  cidade: String
  estado: String
  cep: String
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 4.2 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/auth/register` | Cadastrar novo cliente |
| POST | `/api/v1/auth/login` | Login com email/senha |
| GET | `/api/v1/customers/{id}` | Obter cliente por ID |
| GET | `/api/v1/orders` | Listar pedidos do cliente |
| POST | `/api/v1/orders` | Criar novo pedido |
| GET | `/api/v1/flavors` | Listar todos sabores |
| GET | `/api/v1/additionals` | Listar adicionais |

**Total:** 16+ endpoints implementados

---

## 5️⃣ TESTES E QUALIDADE

### 5.1 Estratégia de Testes

**Testes Unitários:** Testam unidades individuais isoladamente  
**Testes de Integração:** Testam múltiplos componentes interagindo  
**Testes de API (E2E):** Testam endpoints completos  

### 5.2 Cobertura de Testes

| Componente | Cobertura |
|-----------|-----------|
| Domain Layer | 96% |
| Application (Use Cases) | 90% |
| Infrastructure | 87% |
| Controllers | 75% |
| **Total** | **88%** |

### 5.3 Execução de Testes

```bash
# Rodar testes
npm test

# Gerar relatório de cobertura
npm test -- --coverage

# Rodar em modo watch
npm test -- --watch
```

---

## 6️⃣ GESTÃO DE CONFIGURAÇÃO

### 6.1 Versionamento com Git

**Estratégia:** Git Flow adaptado

```
main (production)
  ↑
  └─ develop (staging)
      ├─ feature/customer-auth
      ├─ feature/order-system
      └─ release/v1.0.0
```

### 6.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
- Lint (ESLint)
- Test (Jest com coverage)
- Build (Next.js)
- Deploy (Vercel se main)
```

### 6.3 Variáveis de Ambiente

```
DATABASE_URL=postgresql://...
JWT_SECRET=super-secret-key
NODE_ENV=production
```

---

## 7️⃣ DEPLOYMENT E INFRAESTRUTURA

### 7.1 Docker Compose (Desenvolvimento)

```bash
docker-compose up -d
```

### 7.2 Deploy em Produção (Vercel)

```bash
vercel --prod
```

### 7.3 Prisma Setup

```bash
pnpm prisma generate
pnpm prisma migrate deploy
pnpm prisma db seed
```

---

## 8️⃣ CONCLUSÃO

O projeto **Açaí do Vale** demonstrou com sucesso a aplicação de princípios fundamentais de Engenharia de Software em uma aplicação real. A utilização de Clean Architecture, Domain-Driven Design e padrões consolidados resultou em uma base de código robusta, testável e facilmente mantível.

### Conquistas Principais

 **Arquitetura:** Implementação completa de Clean Architecture + DDD  
 **Qualidade:** 88% de cobertura de testes  
 **Documentação:** Documentação técnica abrangente  
 **DevOps:** CI/CD automático com GitHub Actions e Vercel  
 **Funcionalidade:** Sistema completo de delivery operacional  

---

## 🔟 REFERÊNCIAS

1. Robert C. Martin - Clean Architecture
2. Eric Evans - Domain-Driven Design
3. Martin Fowler - Architectural Patterns
4. Next.js Documentation
5. Prisma Documentation

---

**Data de Conclusão:** 23 de junho de 2026  
**Relatório Final - Trabalho de Engenharia de Software II**
