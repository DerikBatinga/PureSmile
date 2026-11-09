package com.pure.smile.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tratamento {
    private Long idTratamento;
    private String descricao;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private Status statusTratamento = Status.PENDENTE;
    private int quantidade;
    private double valorUnitario;

    public void concluirTratamento() {
        this.statusTratamento = Status.CONCLUIDO;
    }

    public void cancelarTratamento() {
        this.statusTratamento = Status.CANCELADO;
    }

    public void planejarTratamento() {
        this.statusTratamento = Status.PLANEJADO;
    }

    public void emAndamentoTratamento() {
        this.statusTratamento = Status.EM_ANDAMENTO;
    }

    public double calcularValorTotal() {
        return this.quantidade * this.valorUnitario;
    }
}
