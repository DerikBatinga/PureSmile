package com.pure.smile.model;

import java.time.LocalDateTime;

public class Tratamento {
    private Long idTratamento;
    private String descricao;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private Status statusTratamento;
    private int quantidade;

    public Tratamento() {
    }

    public Tratamento(Long idTratamento, String descricao, LocalDateTime dataInicio, LocalDateTime dataFim, Status status, int quantidade) {
        this.idTratamento = idTratamento;
        this.descricao = descricao;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.statusTratamento = status;
        this.quantidade = quantidade;
    }

    public void concluirTratamento(){
        this.statusTratamento = Status.valueOf("CONCLUIDO");
    }

    public void cancelarTratamento(){
        this.statusTratamento = Status.valueOf("CANCELADO");
    }

    public void planejarTratamento(){
        this.statusTratamento = Status.valueOf("PLANEJADO");
    }

    public void em_andamentoTratamento(){
        this.statusTratamento = Status.valueOf("EM_ANDAMENTO");
    }

    public double calcularValorTotal(){
        return this.quantidade * this.dataInicio.getSecond();
    }
}
