package com.pure.smile.model;

public class Consulta {
    private Long idConvenio;
    private String nome;
    private String cnpj;
    private String email;
    private String status;

    public Consulta() {

    }

    public Consulta(Long idConvenio, String nome, String cnpj, String email, String status) {
        this.idConvenio = idConvenio;
        this.nome = nome;
        this.cnpj = cnpj;
        this.email = email;
        this.status = status;
    }
//    Só criando a classe, tem que ajustar
    public boolean verificaConvenio(Consulta consulta) {
        return true;
    }

    public void ativar(Consulta consulta) {

    }

    public void desativar(Consulta consulta) {

    }
}
