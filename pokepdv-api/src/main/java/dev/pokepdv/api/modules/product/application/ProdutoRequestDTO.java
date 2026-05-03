package dev.pokepdv.api.modules.produto.application;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ProdutoRequestDTO {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 255, message = "Nome deve ter no máximo 255 caracteres")
    private String nome;

    @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    private String descricao;

    @NotNull(message = "Preço é obrigatório")
    @DecimalMin(value = "0.01", message = "Preço deve ser maior que zero")
    @Digits(integer = 8, fraction = 2,
            message = "Preço inválido: use no máximo 2 casas decimais")
    private BigDecimal preco;

    private String ean;

    public String     getNome()             { return nome; }
    public void       setNome(String n)      { this.nome = n; }
    public String     getDescricao()         { return descricao; }
    public void       setDescricao(String d) { this.descricao = d; }
    public BigDecimal getPreco()             { return preco; }
    public void       setPreco(BigDecimal p) { this.preco = p; }
    public String     getEan()               { return ean; }
    public void       setEan(String e)       { this.ean = e; }

}