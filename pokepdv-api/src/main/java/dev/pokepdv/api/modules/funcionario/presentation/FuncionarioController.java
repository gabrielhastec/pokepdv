package dev.pokepdv.api.modules.funcionario.presentation;

import dev.pokepdv.api.modules.funcionario.domain.Funcionario;
import dev.pokepdv.api.modules.funcionario.domain.FuncionarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/funcionarios")
public class FuncionarioController {

    private static final UUID TENANT_ID =
            UUID.fromString("00000000-0000-0000-0000-000000000001");

    private final FuncionarioRepository repo;
    private final PasswordEncoder passwordEncoder;

    public FuncionarioController(FuncionarioRepository repo,
                                 PasswordEncoder passwordEncoder) {
        this.repo            = repo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Funcionario> listar() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<Funcionario> criar(@Valid @RequestBody Funcionario funcionario) {
        if (repo.existsByEmailAndTenantId(funcionario.getEmail().toLowerCase(), TENANT_ID)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado");
        }
        funcionario.setId(null);
        funcionario.setEmail(funcionario.getEmail().toLowerCase());
        funcionario.setTenantId(TENANT_ID);
        funcionario.setSenha(passwordEncoder.encode(funcionario.getSenha()));
        funcionario.setAtivo(true);
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(funcionario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> atualizar(@PathVariable UUID id,
                                                 @Valid @RequestBody Funcionario dados) {
        Funcionario existente = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Funcionário não encontrado"));

        if (!existente.getEmail().equals(dados.getEmail().toLowerCase())) {
            if (repo.existsByEmailAndTenantIdAndIdNot(
                    dados.getEmail().toLowerCase(), TENANT_ID, id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado");
            }
        }

        existente.setNome(dados.getNome());
        existente.setEmail(dados.getEmail().toLowerCase());
        existente.setRole(dados.getRole());

        if (dados.getSenha() != null && !dados.getSenha().isBlank()) {
            existente.setSenha(passwordEncoder.encode(dados.getSenha()));
        }

        return ResponseEntity.ok(repo.save(existente));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alternarStatus(@PathVariable UUID id) {
        Funcionario func = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Funcionário não encontrado"));

        if (func.isAtivo() && func.getRole() == Funcionario.Role.ADMIN) {
            long adminsAtivos = repo.countByRoleAndAtivoAndTenantId(
                    Funcionario.Role.ADMIN, true, TENANT_ID);
            if (adminsAtivos <= 1) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Não é possível inativar o último administrador ativo");
            }
        }

        func.setAtivo(!func.isAtivo());
        repo.save(func);
        return ResponseEntity.ok().build();
    }
}
