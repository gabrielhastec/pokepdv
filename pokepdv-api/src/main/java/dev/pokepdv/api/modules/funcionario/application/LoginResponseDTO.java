package dev.pokepdv.api.modules.funcionario.application;

public class LoginResponseDTO {
    private final String token;
    private final String role;
    private final String nome;

    public LoginResponseDTO(String token, String role, String nome) {
        this.token = token;
        this.role  = role;
        this.nome  = nome;
    }

    public String getToken() { return token; }
    public String getRole()  { return role; }
    public String getNome()  { return nome; }
}
