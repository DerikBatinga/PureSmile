package com.pure.smile.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DentistaRequest {
    @NotBlank(message = "Nome completo é obrigatório!")
    @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
    private String nomeCompleto;

    @NotBlank(message = "CPF é obrigatório!")
    @Pattern(regexp = "\\d{11}", message = "CPF deve conter 11 dígitos numéricos")
    private String cpf;

    @NotBlank(message = "Email é obrigatório!")
    @Email(message = "Email inválido")
    @Size(max = 100)
    private String email;

    @NotBlank(message = "Senha é obrigatória!")
    @Size(min = 6, max = 100, message = "Senha deve ter entre 6 e 100 caracteres")
    private String senha;

    @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
    private String telefone;

    @NotNull(message = "Data de nascimento é obrigatória")
    @Past(message = "Data de nascimento deve ser no passado")
    private LocalDateTime dataNascimento;

    @NotBlank(message = "CRO é obrigatório!")
    @Size(max = 20, message = "CRO deve ter no máximo 20 caracteres")
    private String cro;

    @NotBlank(message = "Especialidade é obrigatória!")
    @Size(max = 100, message = "Especialidade deve ter no máximo 100 caracteres!")
    private String especialidade;
}
