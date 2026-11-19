package com.pure.smile.dto.response;

import com.pure.smile.enums.UsuarioRole;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PacienteResponse {
    private Long idUsuario;
    private String nomeCompleto;
    private String cpf;
    private String email;
    private String telefone;
    private LocalDateTime dataNascimento;
    private boolean status;
    private UsuarioRole role;
}