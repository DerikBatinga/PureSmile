package com.pure.smile.dto.response;

import com.pure.smile.enums.UsuarioRole;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class DentistaResponse {
    private Long idUsuario;
    private String nomeCompleto;
    private String cro;
    private String email;
    private String telefone;
    private LocalDate dataNascimento;
    private boolean status;
    private UsuarioRole role;
}