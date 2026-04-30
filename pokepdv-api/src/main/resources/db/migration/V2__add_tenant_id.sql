-- V2: Multi-tenancy -- tenant_id obrigatório em todas as tabelas
ALTER TABLE produto
    ADD COLUMN tenant_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';

-- Índice para performance em queries multi-tenant
CREATE INDEX idx_produto_tenant_id ON produto(tenant_id);

-- Remover default após adicionar coluna (produção exige valor explícito)
ALTER TABLE produto ALTER COLUMN tenant_id DROP DEFAULT;