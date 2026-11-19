package com.pure.smile.dto.response;

import lombok.Data;

@Data
public class ConvenioResponse {
    private Long idConvenio;
    private String nome;
    private String cnpj;
    private String email;
    private String telefone;
    private boolean ativo;
    private String coberturaDescricao;
}