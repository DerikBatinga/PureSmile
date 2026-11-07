package com.pure.smile.model;

public class Procedimento {
    private Long idProcedimento;
    private String nome;
    private String descricao;
    private double preco;
    private Status statusProcedimento;

    public Procedimento() {

    }

    public Procedimento(Long idProcedimento, String nome, String descricao, double preco,  Status status) {
        this.idProcedimento = idProcedimento;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.statusProcedimento = status;
    }

    public void concluirProcedimento(){
        this.statusProcedimento = Status.valueOf("CONCLUIDO");
    }

    public void cancelarProcedimento(){
        this.statusProcedimento = Status.valueOf("CANCELADO");
    }

    public void planejarProcidimento(){
        this.statusProcedimento = Status.valueOf("PLANEJADO");
    }

    public void em_andamentoProcedimento(){
        this.statusProcedimento = Status.valueOf("EM_ANDAMENTO");
    }


}
