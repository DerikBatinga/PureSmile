package com.pure.smile.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Consulta {
    private Long idConsulta;
    private Long idPaciente;
    private Long idDentista;
    private LocalDateTime dataConsulta;
    private Status statusConsulta;
    private String observacao;

    public Consulta() {
    }

    public Consulta(Long idConsulta, Long idPaciente, Long idDentista, LocalDateTime dataConsulta, Status statusConsulta, String observacao) {
        this.idConsulta = idConsulta;
        this.idPaciente = idPaciente;
        this.idDentista = idDentista;
        this.dataConsulta = dataConsulta;
        this.statusConsulta = statusConsulta;
        this.observacao = observacao;
    }

    public void concluirConsulta(){
        this.statusConsulta = Status.valueOf("CONCLUIDO");
    }

    public void cancelarConsulta(){
        this.statusConsulta = Status.valueOf("CANCELADO");
    }

    public void planejarConsulta(){
        this.statusConsulta = Status.valueOf("PLANEJADO");
    }

    public void em_andamentoConsulta(){
        this.statusConsulta = Status.valueOf("EM_ANDAMENTO");
    }
}
