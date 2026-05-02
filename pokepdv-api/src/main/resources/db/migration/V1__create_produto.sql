CREATE TABLE produto (
                         id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
                         nome          VARCHAR(255)  NOT NULL,
                         descricao     TEXT,
                         preco         NUMERIC(10,2) NOT NULL,
                         ean           VARCHAR(13),
                         ativo         BOOLEAN       NOT NULL DEFAULT TRUE,
                         tenant_id     UUID          NOT NULL,
                         criado_em     TIMESTAMP     NOT NULL DEFAULT NOW(),
                         atualizado_em TIMESTAMP
);

CREATE UNIQUE INDEX uq_produto_nome_tenant ON produto(nome, tenant_id);
CREATE UNIQUE INDEX uq_produto_ean_tenant ON produto(ean, tenant_id) WHERE ean IS NOT NULL;
CREATE INDEX idx_produto_tenant ON produto(tenant_id);
