package dev.pokepdv.api.modules.produto.application;

import dev.pokepdv.api.modules.produto.domain.Produto;
import dev.pokepdv.api.modules.produto.domain.ProdutoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class ProdutoUseCase {

    private static final UUID TENANT_ID =
            UUID.fromString("00000000-0000-0000-0000-000000000001");

    private final ProdutoRepository repository;

    public ProdutoUseCase(ProdutoRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Produto criar(ProdutoRequestDTO dto) {
        if (repository.existsByNomeAndTenantId(dto.getNome().trim(), TENANT_ID)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nome de produto já cadastrado");
        }

        String ean = normalizarEan(dto.getEan());
        if (ean != null) {
            validarFormatoEan(ean);
            if (repository.existsByEanAndTenantId(ean, TENANT_ID)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "EAN já cadastrado");
            }
        }

        Produto produto = new Produto();
        produto.setNome(dto.getNome().trim());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setEan(ean);
        produto.setTenantId(TENANT_ID);
        return repository.save(produto);
    }

    @Transactional
    public Produto atualizar(UUID id, ProdutoRequestDTO dto) {
        Produto existente = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));

        if (repository.existsByNomeAndTenantIdAndIdNot(dto.getNome().trim(), TENANT_ID, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nome de produto já cadastrado");
        }

        String ean = normalizarEan(dto.getEan());
        if (ean != null) {
            validarFormatoEan(ean);
            if (repository.existsByEanAndTenantIdAndIdNot(ean, TENANT_ID, id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "EAN já cadastrado");
            }
        }

        existente.setNome(dto.getNome().trim());
        existente.setDescricao(dto.getDescricao());
        existente.setPreco(dto.getPreco());
        existente.setEan(ean);
        return repository.save(existente);
    }

    @Transactional
    public void alternarStatus(UUID id) {
        Produto produto = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
        produto.setAtivo(!produto.isAtivo());
        repository.save(produto);
    }

    private String normalizarEan(String ean) {
        if (ean == null || ean.isBlank()) return null;
        return ean.trim();
    }

    private void validarFormatoEan(String ean) {
        if (!ean.matches("\\d{8}|\\d{12}|\\d{13}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "EAN inválido: deve ter 8, 12 ou 13 dígitos numéricos");
        }
    }
}