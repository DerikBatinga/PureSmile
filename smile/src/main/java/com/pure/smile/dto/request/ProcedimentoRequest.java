package com.pure.smile.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProcedimentoRequest {
    @NotBlank(message = "Nome do procedimento é obrigatório!")
    @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
    private String nome;

    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    private String descricao;

    @NotNull(message = "Preço é obrigatório!")
    private double preco;
}