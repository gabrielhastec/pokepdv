-- V1: Schema inicial -- tabelas base sem tenant_id
CREATE TABLE IF NOT EXISTS produto (
                                       id UUID PRIMARY KEY,
                                       nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP
    );