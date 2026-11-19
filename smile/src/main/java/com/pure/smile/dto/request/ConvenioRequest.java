package com.pure.smile.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ConvenioRequest {
    @NotBlank(message = "Nome do convênio é obrigatório!")
    @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
    private String nome;

    @NotBlank(message = "CNPJ é obrigatório!")
    @Pattern(regexp = "\\d{14}", message = "CNPJ deve conter 14 dígitos numéricos")
    private String cnpj;

    @NotBlank(message = "Email é obrigatório!")
    @Email(message = "Email inválido")
    @Size(max = 100)
    private String email;

    @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
    private String telefone;

    @Size(max = 500, message = "Cobertura deve ter no máximo 500 caracteres")
    private String coberturaDescricao;
}