package com.pure.smile.model;

import java.time.LocalDateTime;

public class Dentista extends Usuario {
    private String cro;
    private String especialidade;

    public Dentista() {}

    public Dentista(String cro, String especialidade) {
        this.cro = cro;
        this.especialidade = especialidade;
    }
    //    Só criando a classe, tem que ajustar
    public boolean verificarDisponibilidade(LocalDateTime dataHora) {
        return true;
    }

    public void registrarAtendimento(Convenio consulta) {

    }
}
