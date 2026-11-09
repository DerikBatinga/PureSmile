package com.pure.smile.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Paciente extends Usuario {

    public Paciente(Long idUsuario, String nomeCompleto, String cpf, String email, String senhaHash, String telefone, LocalDateTime dataNascimento, boolean status) {
        super(idUsuario, nomeCompleto, cpf, email, senhaHash, telefone, dataNascimento, status, Role.PACIENTE);
    }

    public void marcarConsulta() {
    }

    public void cancelarConsulta() {
    }

    public void consultarHistorico() {
    }
}
