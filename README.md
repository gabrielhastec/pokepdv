# 🎮 PokePDV — Sistema de Ponto de Venda Híbrido

[![Fase 1 - Setup](https://img.shields.io/badge/Fase%201-Setup%20Conclu%C3%ADdo-brightgreen?style=flat-square&logo=github)](#)
[![CI - PokePDV](https://img.shields.io/badge/CI-Pipeline%20Configurado-4c1?style=flat-square&logo=githubactions)](https://github.com/gabrielhastec/pokepdv/actions)
[![JaCoCo](https://img.shields.io/badge/cobertura-80%25%20exigida-red?style=flat-square&logo=jacoco)](https://www.jacoco.org/)
[![Java 17](https://img.shields.io/badge/java-17-007396?style=flat-square&logo=openjdk&logoColor=white)](https://adoptium.net/)
[![Spring Boot 3](https://img.shields.io/badge/spring%20boot-3.2.5-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/react-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite 5](https://img.shields.io/badge/vite-5.3-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-propriet%C3%A1rio-black?style=flat-square)](#)

**PokePDV** é uma plataforma de automação comercial híbrida projetada para operar em ambientes **online** (PDV Cloud) e **offline** (PDV Desktop/Mobile), com foco em resiliência, multi-tenancy e experiência de venda ágil.  
O sistema abrange desde a operação de frente de caixa até o gerenciamento administrativo (retaguarda) e emissão fiscal, tudo orquestrado por uma arquitetura limpa e evolutiva.

---

## 📍 Status Atual do Projeto

| Fase   | Descrição                           | Status             |
|:-------|:------------------------------------|:-------------------|
| F1     | Setup de Infraestrutura e Dependências | ✅ Concluída      |
| F2     | Domínio + API Base (Clean Arch)     | ⏳ Em planejamento |
| F3     | CRUD + Auth + JWT + Testes          | ⏳ Planejada       |
| F4     | Retaguarda Web (Admin)              | ⏳ Planejada       |
| F5–F6  | PDV Desktop e Mobile                | 🔮 Futuro          |
| F7–F10 | SaaS, Sync Engine, Observabilidade  | 🔮 Futuro          |

> **Atualização mais recente:** 30 de Abril de 2026 — Fase 1 mergeada com sucesso.

---

## 🧱 Arquitetura do Monorepo
```text
pokepdv/
├── .github/                      # CI/CD, templates de PR
│   └── workflows/ci.yml          # Pipeline GitHub Actions
├── pokepdv-api/                  # ☕ Backend Cloud (Spring Boot)
│   ├── src/main/java/dev/pokepay/api/
│   │   ├── domain/               # Entidades puras e regras de negócio
│   │   ├── application/          # Casos de uso e orquestração
│   │   ├── infrastructure/       # Adapters (JPA, segurança, etc.)
│   │   └── presentation/         # Controllers REST e DTOs
│   └── src/main/resources/
│       └── db/migration/         # Migrações Flyway versionadas
├── pokepdv-admin/                # 🖥️ Retaguarda Web (React + Vite)
│   └── src/
│       └── features/             # Módulos por funcionalidade
├── shared/types/                 # 📦 Tipos TypeScript compartilhados
└── .github/                      # Templates e hooks
```

---

## ⚙️ Stack Tecnológica

### 🔙 Backend (API Cloud)
- **Java 17** + **Spring Boot 3.2.5** — runtime robusto e moderno
- **Spring Data JPA** com **Hibernate** — persistência relacional
- **PostgreSQL 14+** — banco principal (dev / prod)
- **Flyway** — versionamento declarativo de schema
- **Spring Security** + **JWT (jjwt 0.11.5)** — autenticação stateless
- **JaCoCo** — cobertura mínima de 80% em `domain` e `application`
- **JUnit 5** + **H2** — testes unitários e de integração isolados

### 🖥️ Frontend (Retaguarda Admin)
- **React 18** + **Vite 5** + **TypeScript 5.5** — DX rápida e segura
- **TanStack Query** — gerenciamento de estado servidor
- **Axios** — cliente HTTP
- **React Hook Form** + **Zod** — formulários e validação
- **Tailwind CSS 3.4** — utility-first CSS
- **Vitest** + **React Testing Library** + **MSW** — testes e mocks

### 📱 PDV Desktop/Mobile (futuro)
- **Zustand** — gerenciamento de estado local
- **Dexie.js** — IndexedDB para operação offline
- **PWA** — estratégia de instalação local (desktop/mobile)

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- **Java 17** ([Temurin](https://adoptium.net/) recomendado)
- **Maven** (ou use o wrapper `./mvnw` incluso)
- **Node.js 20** (com npm 10+)
- **PostgreSQL 14+** (ou use Docker)

### 1. Clonar e configurar hooks
```bash
git clone [https://github.com/gabrielhastec/pokepdv.git](https://github.com/gabrielhastec/pokepdv.git)
cd pokepdv
chmod +x setup-hooks.sh && ./setup-hooks.sh
```

### 2. Subir o Backend
```bash
cd pokepdv-api
cp .env.example .env          # preencher com credenciais reais
./mvnw spring-boot:run
```
> A API estará disponível em `http://localhost:8080`. As migrations Flyway serão executadas automaticamente na inicialização.

### 3. Rodar o Admin (Retaguarda)
```bash
cd pokepdv-admin
cp .env.example .env.local
npm install
npm run dev
```
> A interface estará em `http://localhost:5173` e se comunicará com a API através da variável `VITE_API_BASE_URL`.

---

## 🔁 Pipeline CI/CD

O arquivo `.github/workflows/ci.yml` dispara em push e pull requests para as branches `main`, `develop` e branches de feature. O pipeline executa:

- **Backend:** `mvn verify` (testes + validação de cobertura ≥ 80% no JaCoCo)
- **Frontend:** `npm ci`, `npm run test` (Vitest) e `npm run build` (checagem TypeScript)
- **Validação de branch:** impede branches fora da convenção `tipo/descricao-em-kebab`

---

## 📜 Convenções do Projeto (Obrigatórias)

### 🏷️ Nomenclatura de Branches
| Tipo       | Exemplo                        |
|:-----------|:-------------------------------|
| `feat/`    | `feat/api-crud-produto`        |
| `fix/`     | `fix/api-cors-origem-admin`    |
| `chore/`   | `chore/setup-dependencias`     |
| `docs/`    | `docs/readme-instrucoes`       |
| `test/`    | `test/api-jacoco-80`           |
| `refactor/`| `refactor/api-clean-arch`      |

### 📝 Mensagens de Commit (Conventional Commits)
```text
<tipo>(<escopo>): <descrição imperativa em português>

Exemplos:
chore(repo): atualiza .gitignore para monorepo
feat(api): implementa cadastro de produto
fix(admin): corrige validação do formulário de login
```
*(Commits fora desse padrão são rejeitados pelo hook local e pelo CI.)*

---

## 🎯 Definition of Done (Pull Request)

Todo PR deve atender ao checklist completo no template `.github/PULL_REQUEST_TEMPLATE.md`.  
**Destaques:**
- [x] Branch dentro da convenção
- [x] Escopo atômico (um módulo por PR)
- [x] Nenhuma credencial exposta
- [x] Migration Flyway versionada (se alterar schema)
- [x] CI verde (testes passam, cobertura ≥ 80%)
- [x] Code review aprovado

---

## 🔐 Decisões Invioláveis do Projeto

1. **Clean Architecture:** `domain/` nunca importa Spring, JPA ou qualquer framework externo.
2. **TDD obrigatório:** o teste falha (RED) antes do código de produção.
3. UUIDs gerados no cliente (PDV Desktop) para todas as entidades transacionais.
4. `tenant_id` obrigatório em todas as tabelas (migration V2).
5. Flyway para todo e qualquer alteração de schema; `ddl-auto: validate` em produção.
6. Nenhum merge direto na main sem PR aprovado.
7. Arquivos `.env` com valores reais jamais entram no repositório.

---

## 📂 Documentação Complementar
- Diretrizes de Versionamento (Fase 1) *
- Plano de Onboarding *(em breve)*

## 👥 Time
- **Desenvolvedor** – Gabriel Hastec

## 📄 Licença
Este projeto é proprietário e de uso restrito. Consulte o desenvolvedor para mais informações.

> **PokePDV** — Automação comercial com a resiliência que sua operação merece.
