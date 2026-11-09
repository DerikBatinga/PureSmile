package com.pure.smile.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consulta {
    private Long idConsulta;
    private Long idPaciente;
    private Long idDentista;
    private LocalDateTime dataConsulta;
    private Status statusConsulta = Status.PENDENTE;
    private String observacao;

    public void concluirConsulta() {
        this.statusConsulta = Status.CONCLUIDO;
    }

    public void cancelarConsulta() {
        this.statusConsulta = Status.CANCELADO;
    }

    public void planejarConsulta() {
        this.statusConsulta = Status.PLANEJADO;
    }

    public void emAndamentoConsulta() {
        this.statusConsulta = Status.EM_ANDAMENTO;
    }
}
