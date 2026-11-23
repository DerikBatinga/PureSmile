package com.pure.smile.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProcedimentoRequest {
    @NotBlank(message = "Nome do procedimento é obrigatório!")
    @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
    private String nome;

    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    private String descricao;

    @NotNull(message = "Preço é obrigatório!")
    @DecimalMin(value = "0.00", message = "Preço não pode ser negativo")
    @Digits(integer = 8, fraction = 2, message = "Preço deve ter até 8 dígitos inteiros e 2 casas decimais")
    private BigDecimal preco;
}
