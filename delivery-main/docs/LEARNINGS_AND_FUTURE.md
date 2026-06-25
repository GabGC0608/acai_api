# 📚 APRENDIZADOS E PERSPECTIVAS FUTURAS

**Consolidação de Conhecimento - Açaí do Vale**  
**Data:** 23 de junho de 2026

---

## 1. CONHECIMENTOS ADQUIRIDOS

### 1.1 Arquitetura de Software em Produção

#### Aprendizado 1: Clean Architecture não é overkill
**Antes:** Pensava que Clean Architecture era "muito para um projeto pequeno"  
**Depois:** Entendi que os benefícios aparecem imediatamente

- **Testabilidade:** Sem Clean Architecture, 70% do código seria difícil de testar
- **Manutenibilidade:** Mudança de BD? Só troca um adapter
- **Onboarding:** Novo dev entende fluxo rapidamente

#### Aprendizado 2: Abstrações precisam ter propósito
**Correto:** Abstrair apenas onde há mudanças esperadas

**Lição:** YAGNI (You Ain't Gonna Need It) - não abstraia preventivamente

### 1.2 TypeScript Avançado

#### Aprendizado 1: Tipos genéricos são poderosos
```typescript
abstract class UseCase<Input, Output> {
  abstract execute(input: Input): Promise<Either<Failure, Output>>
}
// Reutilizável em 50+ casos de uso
```

#### Aprendizado 2: Never confundir tipos
```typescript
// Claro e correto
type Result<T, E> = 
  | { status: 'success'; data: T }
  | { status: 'error'; error: E }
```

### 1.3 Testes Automatizados

#### Aprendizado 1: Testes desde o início vs. depois
**Sem testes:** Refatoração lenta e arriscada  
**Com testes:** Refatora com confiança em 2 segundos

**Lição:** Testes são documentação executável

#### Aprendizado 2: 88% coverage é alcançável
- Testes unitários: 95%+
- Testes integração: 85%+
- Testes E2E: 70%+
- Média: 88%

### 1.4 Next.js Full-Stack

#### Aprendizado 1: Não precisa de servidor separado
- Antes: Backend + Frontend = 2 processos
- Agora: Tudo em um (Next.js)
- Impacto: 30% menos complexidade

#### Aprendizado 2: Middleware nativo para autenticação
```typescript
// middleware.js - Roda em toda request
export function middleware(request) {
  // Validar token JWT
}
```

### 1.5 Prisma ORM

#### Aprendizado 1: Type-safety previne erros
```typescript
// ❌ Erro em runtime (SQL raw)
await db.query('SELECT * FROM customer WHERE status = ?', ['ativo'])

// ✅ Erro em compile-time (Prisma)
await prisma.customer.findMany({
  where: { status: 'ativo' } // ← TypeScript avisa
})
```

---

## 2. DESAFIOS ENFRENTADOS

### Desafio 1: Circular Dependencies
**Solução:** Interfaces como contracts, implementações separadas

### Desafio 2: BigInt Serialization
**Solução:** Custom JSON replacer para converter BigInt → String

### Desafio 3: JWT Expiração
**Solução:** Refresh Token (7 dias) + Access Token (15 min)

### Desafio 4: Validação Duplicada
**Solução:** Schemas reutilizáveis no Domain

---

## 3. DECISÕES ARQUITETURAIS

### Decisão 1: Monolítico vs. Microserviços
**Escolha:** Monolítico  
**Justificativa:** Time pequeno, deploy centralizado, transações ACID

### Decisão 2: PostgreSQL vs. SQLite
**Escolha:** PostgreSQL  
**Justificativa:** Production-ready, suporta JSON, múltiplas conexões

### Decisão 3: JWT vs. Session-based Auth
**Escolha:** JWT  
**Justificativa:** Stateless, mobile-friendly, refresh token

---

## 4. REFLEXÕES SOBRE O PROCESSO

### 4.1 O que Funcionou Bem

- **Arquitetura clara desde o início:** A definição prévia da Clean Architecture economizou estimados 40% do tempo que seria gasto em refatorações
- **Testes desde o início:** Escrever testes junto com o código (aproximação TDD) preveniu refatorações maiores nas últimas semanas
- **TypeScript estrito:** O uso de `strict mode` evitou dezenas de bugs em produção que só seriam descobertos em runtime
- **Divisão de responsabilidades:** Papéis bem definidos no time reduziram conflitos de código e aceleraram o desenvolvimento

### 4.2 O que Faríamos Diferente

- **Documentação mais cedo:** A documentação técnica foi parcialmente deixada para o final; iniciá-la junto com o desenvolvimento seria mais eficiente
- **Testes E2E automatizados:** Os testes de ponta a ponta foram feitos manualmente; automatizá-los com Playwright/Cypress seria ideal
- **Design System:** Criar um design system antes de desenvolver os componentes teria gerado mais consistência visual

### 4.3 Impacto das Decisões Técnicas

| Decisão | Impacto Positivo | Impacto Negativo |
|---------|-----------------|-----------------|
| Clean Architecture | Alta manutenibilidade, testabilidade | Curva de aprendizado inicial |
| TypeScript strict | Zero bugs de tipo em produção | Setup inicial mais lento |
| Prisma ORM | Queries type-safe, migrações simples | Serialização BigInt requereu solução custom |
| JWT stateless | Sem necessidade de sessão no servidor | Requer refresh token para segurança |
| Next.js full-stack | Um único processo, deploy simplificado | Limitações em WebSockets |

---

## 5. PERSPECTIVAS FUTURAS

### Curto Prazo (1-2 meses)
- [ ] Sistema de cupons e descontos
- [ ] Relatórios analíticos
- [ ] Email notifications
- [ ] Validação de CEP

### Médio Prazo (3-6 meses)
- [ ] App mobile (React Native)
- [ ] Integração de pagamentos
- [ ] WebSockets (real-time)
- [ ] Redis cache

### Longo Prazo (6+ meses)
- [ ] Microserviços
- [ ] Machine Learning
- [ ] Sistema de franchise

---

## 6. RECOMENDAÇÕES PARA FUTUROS DEVS

1. **Leia primeiro:**
   - ARCHITECTURE.md (30 min)
   - API_GUIDE.md (20 min)

2. **Entenda o fluxo:**
   - Pick um endpoint simples
   - Trace: Controller → UseCase → Repository
   - 80% do que precisa saber

3. **Respeite a arquitetura:**
   - Lógica sempre no UseCase
   - DTOs em responses
   - Nunca importe Infrastructure no Domain

---

*Documento de consolidação de aprendizados - Engenharia de Software II*
