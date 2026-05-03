package dev.pokepdv.api.modules.produto.presentation;

import dev.pokepdv.api.modules.produto.application.ProdutoRequestDTO;
import dev.pokepdv.api.modules.produto.application.ProdutoUseCase;
import dev.pokepdv.api.modules.produto.domain.Produto;
import dev.pokepdv.api.modules.produto.domain.ProdutoRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/produtos")
public class ProdutoController {

    private static final UUID TENANT_ID =
            UUID.fromString("00000000-0000-0000-0000-000000000001");

    private final ProdutoUseCase useCase;
    private final ProdutoRepository repository;

    public ProdutoController(ProdutoUseCase useCase, ProdutoRepository repository) {
        this.useCase    = useCase;
        this.repository = repository;
    }

    @GetMapping
    public List<Produto> listar() {
        return repository.findTop50ByTenantIdOrderByCriadoEmDesc(TENANT_ID);
    }

    @PostMapping
    public ResponseEntity<Produto> criar(@Valid @RequestBody ProdutoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(useCase.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable UUID id,
                                             @Valid @RequestBody ProdutoRequestDTO dto) {
        return ResponseEntity.ok(useCase.atualizar(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alternarStatus(@PathVariable UUID id) {
        useCase.alternarStatus(id);
        return ResponseEntity.ok().build();
    }
}
