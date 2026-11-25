package com.pure.smile.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

// Representa o JSON recebido no POST e no PUT; não é uma entidade do banco.
@Data // Lombok gera getters e setters usados pelo Jackson e pelo controller.
public class ProcedimentoRequest {
    // @NotBlank rejeita null, texto vazio e só espaços; @Size limita o tamanho.
    @NotBlank(message = "Nome do procedimento é obrigatório!")
    @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
    private String nome;

    // Descrição é opcional, mas, se informada, tem no máximo 500 caracteres.
    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    private String descricao;

    // BigDecimal evita imprecisão de ponto flutuante em valores monetários.
    // As anotações impedem ausência, preço negativo e precisão fora do banco.
    @NotNull(message = "Preço é obrigatório!")
    @DecimalMin(value = "0.00", message = "Preço não pode ser negativo")
    @Digits(integer = 8, fraction = 2, message = "Preço deve ter até 8 dígitos inteiros e 2 casas decimais")
    private BigDecimal preco;
}
