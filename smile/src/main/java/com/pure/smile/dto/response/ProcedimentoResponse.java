package com.pure.smile.dto.response;

import lombok.Data;

@Data
public class ProcedimentoResponse {
    private Long idProcedimento;
    private String nome;
    private String descricao;
    private double preco;
}