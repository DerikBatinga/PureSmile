package com.pure.smile.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Convenio {
    private Long idConvenio;
    private String nome;
    private String cnpj;
    private String email;
    private Status status = Status.PENDENTE;

    public boolean verificaConvenio(Convenio convenio) {
        return true;
    }

    public void ativar() {
        this.status = Status.CONCLUIDO;
    }

    public void desativar() {
        this.status = Status.CANCELADO;
    }
}
