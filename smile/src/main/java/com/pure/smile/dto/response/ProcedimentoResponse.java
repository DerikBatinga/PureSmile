package com.pure.smile.dto.response;

import lombok.Data;
import java.math.BigDecimal;

// Formato do JSON devolvido ao cliente; separa o contrato HTTP do model interno.
@Data // Lombok gera os métodos de acesso que o Jackson usa na serialização.
public class ProcedimentoResponse {
    // O ID vem do banco após o INSERT; "preco" corresponde a "valor" no model.
    private Long idProcedimento;
    private String nome;
    private String descricao;
    private BigDecimal preco;
}
