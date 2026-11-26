package com.pure.smile.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PacienteResponse {
    private Long idPaciente;
    private Long idUsuario;
    private String nomeCompleto;
    private String email;
    private boolean ativo;
    private String cpf;
    private String sexo;
    private String telefone;
    private LocalDate dataNascimento;
    private Long idConvenio;
}