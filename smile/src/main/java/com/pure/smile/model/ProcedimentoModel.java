package com.pure.smile.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

// Objeto usado entre repository, service e controller para representar um procedimento.
@Data // Getters, setters, equals, hashCode e toString gerados pelo Lombok.
@NoArgsConstructor // Permite criar o objeto vazio antes de preencher seus campos.
@AllArgsConstructor // Usado pelo RowMapper para montar o objeto a partir do banco.
public class ProcedimentoModel {
    // Long corresponde ao BIGINT do SQL Server; BigDecimal preserva valores monetários.
    private Long idProcedimento;
    private String nome;
    private String descricao;
    private BigDecimal valor;
}
