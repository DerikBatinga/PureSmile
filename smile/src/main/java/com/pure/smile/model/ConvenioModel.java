package com.pure.smile.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConvenioModel {
    private Long idConvenio;
    private String nome;
    private String email;
    private String telefone;
    private String cnpj;
    private boolean ativo;
    private String coberturaDescricao;

}
