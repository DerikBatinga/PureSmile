package com.pure.smile.dto.response;

import com.pure.smile.model.Usuario;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class pacienteResponse {
    private Long idUsuario
    private String nomeCompleto;
    private String cpf;
    private String email;
    private String telefone;
    private LocalDateTime dataNascimento;
    private boolean status;
    private Usuario.Role role;
}