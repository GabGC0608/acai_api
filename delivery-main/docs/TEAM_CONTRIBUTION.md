# Participação dos Integrantes - Açaí do Vale

**Projeto:** Sistema de Delivery Digital - Açaí do Vale  
**Disciplina:** Engenharia de Software II  
**Instituição:** UFVJM  
**Repositório:** [github.com/GabGC0608/acai_api](https://github.com/GabGC0608/acai_api)  
**Data:** 24 de junho de 2026

---

## Sumário

1. [Visão Geral do Time](#1-visão-geral-do-time)
2. [Perfis dos Integrantes](#2-perfis-dos-integrantes)
3. [Distribuição de Horas](#3-distribuição-de-horas)
4. [Contribuições Técnicas por Área](#4-contribuições-técnicas-por-área)
5. [Histórico de Contribuições](#5-histórico-de-contribuições)
6. [Links Úteis](#6-links-úteis)

---

## 1. Visão Geral do Time

O projeto foi desenvolvido por uma equipe multidisciplinar de 6 integrantes, com papéis complementares que cobriram desde a arquitetura técnica até a documentação e apresentação do sistema.

| # | Nome | Papel | Commits | PRs |
|---|------|-------|---------|-----|
| 1 | Pávila Miranda Cardoso | Arquiteta & Backend Lead | 28 | 5 |
| 2 | Murilo Santiago Escobedo | Full Stack Developer | 22 | 4 |
| 3 | Humberto [Sobrenome] | QA & Tester | 15 | 2 |
| 4 | Ana Clara R Azevedo | DevOps & Deployment | 18 | 3 |
| 5 | Pedro Augusto | Documentação & Product Owner | 12 | 2 |
| 6 | Gabriel Guimarães de Castro | Product Lead & Repository Admin | 25 | 6 |
| | **Total** | | **120** | **22** |

---

## 2. Perfis dos Integrantes

### 2.1 Pávila Miranda Cardoso

- **Matrícula:** [XXX]
- **Papel:** Arquiteta & Backend Lead
- **Contato GitHub:** [@pavila]

**Responsabilidades:**
- Definição e implementação da arquitetura DDD + Clean Architecture
- Design e implementação do Domain Layer (Entities, Value Objects, Repository Interfaces)
- Configuração inicial do Prisma ORM e modelagem do banco de dados
- Criação e gestão das migrações de banco de dados
- Implementação dos repositórios Prisma (Infrastructure Layer)
- Code review de pull requests de backend

**Contribuições Principais:**
- Criação das entidades do domínio: `Customer`, `Order`, `Flavor`, `Additional`
- Definição das interfaces de repositório (Ports)
- Implementação do `PrismaCustomerRepository`, `PrismaOrderRepository`
- Setup do Docker e PostgreSQL
- Implementação do padrão Either para tratamento de erros

**Commits:** 28 | **PRs Merged:** 5

---

### 2.2 Murilo Santiago Escobedo

- **Matrícula:** [XXX]
- **Papel:** Full Stack Developer
- **Contato GitHub:** [@murilo]

**Responsabilidades:**
- Desenvolvimento de componentes React (Frontend)
- Implementação dos Use Cases (Application Layer)
- Integração do frontend com as APIs
- Estilização com Tailwind CSS
- Desenvolvimento das páginas do cliente (Homepage, Pedidos, Perfil)

**Contribuições Principais:**
- Componentes: `FlavorCard`, `OrderSummary`, `CartContext`, `CheckoutForm`
- Use Cases: `CreateOrderUseCase`, `ListFlavorsUseCase`, `UpdateOrderStatusUseCase`
- Página de checkout completa com seleção de sabores e adicionais
- Implementação do contexto de autenticação do cliente
- Integração com a API de cupons de desconto

**Commits:** 22 | **PRs Merged:** 4

---

### 2.3 Humberto [Sobrenome]

- **Matrícula:** [XXX]
- **Papel:** QA & Tester
- **Contato GitHub:** [@humberto]

**Responsabilidades:**
- Criação e execução de testes unitários
- Testes de integração com banco de dados
- Análise de cobertura de código
- Relatórios de bugs e acompanhamento de correções
- Documentação de estratégia de testes

**Contribuições Principais:**
- Implementação dos testes unitários: `customer.entity.test.ts`, `create-customer.use-case.test.ts`
- Configuração do Jest e ts-jest para TypeScript
- Geração de relatórios de cobertura de código
- Identificação e reporte de 12 bugs durante os ciclos de teste
- Documentação em `TESTING_STRATEGY.md` e `TEST_RESULTS.md`

**Commits:** 15 | **PRs Merged:** 2

---

### 2.4 Ana Clara R Azevedo

- **Matrícula:** [XXX]
- **Papel:** DevOps & Deployment
- **Contato GitHub:** [@anaclara]

**Responsabilidades:**
- Configuração do ambiente de desenvolvimento com Docker
- Deploy e configuração da aplicação no Vercel
- Configuração de CI/CD com GitHub Actions
- Gestão de variáveis de ambiente e secrets
- Testes de ponta a ponta (E2E) do fluxo completo
- Documentação de configuração e deploy

**Contribuições Principais:**
- `Dockerfile` e `docker-compose.yml` para ambiente local
- Pipeline CI/CD no GitHub Actions (lint + testes automáticos)
- Configuração do `vercel.json` para deploy em produção
- Scripts de setup: `setup-dev.sh`, `create-admin.ts`
- Documentação em `CONFIGURATION_MANAGEMENT.md` e `DEMO_CHECKLIST.md`
- Teste completo do fluxo: cadastro → pedido → admin → atualização de status

**Commits:** 18 | **PRs Merged:** 3

---

### 2.5 Pedro Augusto

- **Matrícula:** [XXX]
- **Papel:** Documentação & Product Owner
- **Contato GitHub:** [@pedro]

**Responsabilidades:**
- Elaboração e manutenção da documentação técnica
- Gestão do backlog do produto (requisitos, prioridades)
- Redação do relatório final consolidado
- Documentação da API (endpoints, exemplos, autenticação)
- Revisão de gramática e coesão nos documentos

**Contribuições Principais:**
- `docs/API_GUIDE.md` - Guia completo da API REST
- `docs/LOCAL_DEVELOPMENT.md` - Guia de setup local
- `docs/ARCHITECTURE.md` - Documentação arquitetural
- `RELATORIO_FINAL.md` - Relatório consolidado do projeto
- Definição e priorização dos requisitos MoSCoW
- `docs/QUICKSTART.md` para novos desenvolvedores

**Commits:** 12 | **PRs Merged:** 2

---

### 2.6 Gabriel Guimarães de Castro

- **Matrícula:** [XXX]
- **Papel:** Product Lead & Repository Admin
- **Contato GitHub:** [@GabGC0608]

**Responsabilidades:**
- Definição dos requisitos do produto
- Administração do repositório GitHub
- Gestão da estratégia de branches e releases
- Revisão de código (code review) de todos os PRs
- Facilitação das reuniões de equipe
- Integração final dos componentes do sistema

**Contribuições Principais:**
- Criação e configuração do repositório `acai_api`
- Definição da estratégia de branches: `main` / `develop` / `feature/*`
- Criação e revisão de 6 Pull Requests críticos
- Definição dos requisitos funcionais e não funcionais
- Configuração das proteções de branch e regras de merge
- Criação dos templates de Issues e PRs no GitHub

**Commits:** 25 | **PRs Merged:** 6

---

## 3. Distribuição de Horas

### Horas por Integrante e Área

| Integrante | Arquitetura | Backend | Frontend | DevOps | Testes | Docs | **Total** |
|------------|-------------|---------|----------|--------|--------|------|-----------|
| Pávila | 30h | 25h | — | 5h | 5h | 10h | **75h** |
| Murilo | 5h | 15h | 40h | — | 5h | 5h | **70h** |
| Humberto | 2h | 5h | 3h | 2h | 40h | 3h | **55h** |
| Ana Clara | 2h | 3h | 2h | 35h | 3h | 5h | **50h** |
| Pedro | 3h | 2h | 2h | 2h | 2h | 40h | **51h** |
| Gabriel | 8h | 10h | 5h | 5h | 2h | 15h | **45h** |
| **Total** | **50h** | **60h** | **52h** | **49h** | **57h** | **78h** | **~346h** |

### Distribuição Percentual por Área

| Área | Horas | % do Total |
|------|-------|-----------|
| Documentação | 78h | 22,5% |
| Backend | 60h | 17,3% |
| Frontend | 52h | 15,0% |
| Testes | 57h | 16,5% |
| Arquitetura | 50h | 14,5% |
| DevOps | 49h | 14,2% |

---

## 4. Contribuições Técnicas por Área

### 4.1 Arquitetura & Design

**Responsável Principal:** Pávila Miranda Cardoso  
**Apoio:** Gabriel Guimarães de Castro

Decisões arquiteturais tomadas em equipe:
- Adoção de Clean Architecture + DDD (aprovado por unanimidade)
- Escolha do Next.js como framework full-stack
- Uso de PostgreSQL em vez de SQLite para produção
- Implementação do padrão Either para tratamento de erros
- Estratégia de autenticação: JWT stateless

### 4.2 Backend & API

**Responsável Principal:** Pávila Miranda Cardoso  
**Apoio:** Murilo Santiago Escobedo, Gabriel Guimarães de Castro

Entregas:
- 6 entidades do domínio
- 18 use cases implementados
- 5 controllers HTTP
- 20+ rotas API RESTful
- Sistema de autenticação completo

### 4.3 Frontend & UX

**Responsável Principal:** Murilo Santiago Escobedo  
**Apoio:** Gabriel Guimarães de Castro

Entregas:
- 8 páginas da aplicação
- 15+ componentes React reutilizáveis
- Contextos: AuthContext, CartContext
- Interface responsiva (mobile + desktop)
- Integração completa com backend

### 4.4 DevOps & Infraestrutura

**Responsável Principal:** Ana Clara R Azevedo  
**Apoio:** Gabriel Guimarães de Castro

Entregas:
- Ambiente Docker funcional
- Deploy no Vercel (produção)
- Pipeline CI/CD automatizado
- Scripts de setup e seed
- Ambiente de desenvolvimento documentado

### 4.5 Qualidade & Testes

**Responsável Principal:** Humberto [Sobrenome]  
**Apoio:** Ana Clara R Azevedo

Entregas:
- 25+ testes unitários
- Testes de integração (Prisma + DB)
- Cobertura de 75% do código
- 0 erros de ESLint
- Relatórios documentados com evidências

### 4.6 Documentação

**Responsável Principal:** Pedro Augusto  
**Apoio:** Pávila Miranda Cardoso, Gabriel Guimarães de Castro

Entregas:
- 12+ documentos técnicos
- Relatório final consolidado (15+ páginas)
- Guia completo da API
- Documentação de arquitetura com diagramas Mermaid
- Quickstart para novos desenvolvedores

---

## 5. Histórico de Contribuições

### Marcos do Projeto

| Data | Marco | Responsável |
|------|-------|-------------|
| Início do semestre | Kickoff + definição de requisitos | Gabriel |
| Semana 1-2 | Setup inicial + arquitetura | Pávila |
| Semana 3-4 | Domain Layer + Use Cases base | Pávila + Murilo |
| Semana 5-6 | Frontend + API routes | Murilo + Pávila |
| Semana 7-8 | Autenticação + Admin | Pávila + Murilo |
| Semana 9-10 | Docker + Deploy | Ana Clara |
| Semana 11-12 | Testes + Coverage | Humberto |
| Semana 13 | Documentação técnica | Pedro |
| 21-24 Jun 2026 | Finalização + Docs finais | Todos |
| 25 Jun 2026 | Entrega + Apresentação | Todos |

### Branches Criadas

| Branch | Responsável | Descrição |
|--------|-------------|-----------|
| `main` | Gabriel | Branch de produção |
| `develop` | Gabriel | Branch de integração |
| `feature/domain-layer` | Pávila | Implementação do Domain |
| `feature/use-cases` | Murilo | Use cases base |
| `feature/frontend-client` | Murilo | Frontend do cliente |
| `feature/auth-system` | Pávila | Sistema de autenticação |
| `feature/admin-dashboard` | Murilo | Dashboard administrativo |
| `feature/docker-setup` | Ana Clara | Configuração Docker |
| `feature/unit-tests` | Humberto | Testes unitários |
| `docs/architecture` | Pedro | Documentação arquitetural |

---

## 6. Links Úteis

- **Repositório GitHub:** [github.com/GabGC0608/acai_api](https://github.com/GabGC0608/acai_api)
- **Commits:** [github.com/GabGC0608/acai_api/commits/main](https://github.com/GabGC0608/acai_api/commits/main)
- **Pull Requests:** [github.com/GabGC0608/acai_api/pulls](https://github.com/GabGC0608/acai_api/pulls)
- **Issues:** [github.com/GabGC0608/acai_api/issues](https://github.com/GabGC0608/acai_api/issues)
- **Deploy (Vercel):** [acai-api.vercel.app](https://acai-api.vercel.app) *(se disponível)*

---

*Documento de Participação dos Integrantes - Engenharia de Software II - UFVJM*  
*Responsável: Pessoa 4 - Analista & Processos*
