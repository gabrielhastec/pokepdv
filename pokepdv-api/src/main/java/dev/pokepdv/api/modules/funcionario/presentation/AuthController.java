package dev.pokepdv.api.modules.funcionario.presentation;

import dev.pokepdv.api.modules.funcionario.application.LoginRequestDTO;
import dev.pokepdv.api.modules.funcionario.application.LoginResponseDTO;
import dev.pokepdv.api.modules.funcionario.domain.FuncionarioRepository;
import dev.pokepdv.api.infrastructure.config.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final UUID TENANT_ID =
            UUID.fromString("00000000-0000-0000-0000-000000000001");

    private final FuncionarioRepository repo;
    private final JwtService jwtService;
    private final PasswordEncoder encoder;

    public AuthController(FuncionarioRepository repo,
                          JwtService jwtService,
                          PasswordEncoder encoder) {
        this.repo       = repo;
        this.jwtService = jwtService;
        this.encoder    = encoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        var funcionario = repo
                .findByEmailAndTenantId(request.getEmail().toLowerCase(), TENANT_ID)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));

        if (!encoder.matches(request.getSenha(), funcionario.getSenha())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        if (!funcionario.isAtivo()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Funcionário inativo");
        }

        String token = jwtService.generateToken(
                funcionario.getEmail(),
                funcionario.getRole().name(),
                funcionario.getNome());

        return ResponseEntity.ok(
                new LoginResponseDTO(token,
                        funcionario.getRole().name(),
                        funcionario.getNome()));
    }
}
