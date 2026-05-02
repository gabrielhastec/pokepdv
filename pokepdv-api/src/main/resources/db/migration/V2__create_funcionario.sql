CREATE TABLE funcionario (
                             id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
                             nome          VARCHAR(100) NOT NULL,
                             email         VARCHAR(255) NOT NULL,
                             senha         VARCHAR(255) NOT NULL,
                             role          VARCHAR(20)  NOT NULL CHECK (role IN ('ADMIN', 'OPERADOR')),
                             ativo         BOOLEAN      NOT NULL DEFAULT TRUE,
                             tenant_id     UUID         NOT NULL,
                             criado_em     TIMESTAMP    NOT NULL DEFAULT NOW(),
                             atualizado_em TIMESTAMP
);

CREATE UNIQUE INDEX uq_funcionario_email_tenant ON funcionario(email, tenant_id);
CREATE INDEX idx_funcionario_tenant ON funcionario(tenant_id);

-- Seed do admin: senha admin123
INSERT INTO funcionario (id, nome, email, senha, role, tenant_id)
VALUES (
           '00000000-0000-0000-0000-000000000010',
           'Admin Master',
           'admin@pokepdv.com',
           '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
           'ADMIN',
           '00000000-0000-0000-0000-000000000001'
       );
