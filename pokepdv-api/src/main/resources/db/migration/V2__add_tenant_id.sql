-- V2: Funcionários com papéis ADMIN e OPERADOR
CREATE TABLE funcionario (
                             id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
                             nome          VARCHAR(100) NOT NULL,
                             email         VARCHAR(255) NOT NULL,
                             senha         VARCHAR(255) NOT NULL,
                             role          VARCHAR(20)  NOT NULL CHECK (role IN ('ADMIN','OPERADOR')),
                             ativo         BOOLEAN      NOT NULL DEFAULT TRUE,
                             tenant_id     UUID         NOT NULL,
                             criado_em     TIMESTAMP    NOT NULL DEFAULT NOW(),
                             atualizado_em TIMESTAMP
);

-- Unicidade: email único por tenant
CREATE UNIQUE INDEX uq_funcionario_email_tenant
    ON funcionario(email, tenant_id);

-- Performance: filtro por tenant
CREATE INDEX idx_funcionario_tenant ON funcionario(tenant_id);

-- Seed: admin padrão para a demo
-- senha: admin123 (hash BCrypt custo 10 — não altere este valor)
INSERT INTO funcionario (id, nome, email, senha, role, tenant_id)
VALUES (
           '00000000-0000-0000-0000-000000000010',
           'Admin Master',
           'admin@pokepdv.com',
           '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
           'ADMIN',
           '00000000-0000-0000-0000-000000000001'
       );
