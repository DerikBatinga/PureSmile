package com.pure.smile.model;

public class Convenio {
    private Long idConvenio;
    private String nome;
    private String cnpj;
    private String email;
    private String status;

    public Convenio() {

    }

    public Consulta(Long idConvenio, String nome, String cnpj, String email, String status) {
        this.idConvenio = idConvenio;
        this.nome = nome;
        this.cnpj = cnpj;
        this.email = email;
        this.status = status;
    }
    //    Só criando a classe, tem que ajustar
    public boolean verificaConvenio(Convenio convenio) {
        return true;
    }

    public void ativar(Convenio convenio) {

    }

    public void desativar(Convenio convenio) {

    }
}
