package com.pure.smile.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Procedimento {
    private Long idProcedimento;
    private String nome;
    private String descricao;
    private double preco;
    private Status statusProcedimento = Status.PENDENTE;

    public void concluirProcedimento() {
        this.statusProcedimento = Status.CONCLUIDO;
    }

    public void cancelarProcedimento() {
        this.statusProcedimento = Status.CANCELADO;
    }

    public void planejarProcedimento() {
        this.statusProcedimento = Status.PLANEJADO;
    }

    public void emAndamentoProcedimento() {
        this.statusProcedimento = Status.EM_ANDAMENTO;
    }
}
