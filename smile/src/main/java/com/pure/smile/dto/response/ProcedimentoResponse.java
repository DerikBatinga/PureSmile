package com.pure.smile.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProcedimentoResponse {
    private Long idProcedimento;
    private String nome;
    private String descricao;
    private BigDecimal preco;
}
