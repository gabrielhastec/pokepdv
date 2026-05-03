package dev.pokepdv.api.modules.funcionario.application;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequestDTO {

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    private String senha;

    public String getEmail() { return email; }
    public void   setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void   setSenha(String senha) { this.senha = senha; }
}
