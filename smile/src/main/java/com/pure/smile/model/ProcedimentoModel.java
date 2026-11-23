package com.pure.smile.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcedimentoModel {
    private Long idProcedimento;
    private String nome;
    private String descricao;
    private BigDecimal valor;
}
