package com.pure.smile.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dentista extends Usuario {
    private String cro;
    private String especialidade;

    public Dentista(Long idUsuario, String nomeCompleto, String cpf, String email, String senhaHash, String telefone, LocalDateTime dataNascimento, boolean status, String cro, String especialidade) {
        super(idUsuario, nomeCompleto, cpf, email, senhaHash, telefone, dataNascimento, status, Role.DENTISTA);
        this.cro = cro;
        this.especialidade = especialidade;
    }

    public boolean verificarDisponibilidade(LocalDateTime dataHora) {
        return true;
    }

    public void registrarAtendimento(Consulta consulta) {
    }
}
