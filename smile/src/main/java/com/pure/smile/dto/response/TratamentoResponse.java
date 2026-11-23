package com.pure.smile.dto.response;

import com.pure.smile.enums.TratamentoPagamento;
import com.pure.smile.enums.TratamentoStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
public class TratamentoResponse {
    private Long idTratamento;
    private String nome;
    private String descricao;
    private String status;
    private TratamentoStatus statusTratamento;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private Long idPaciente;
    private Long idConsulta;

    // ─── CAMPOS DE PAGAMENTO ───
    private BigDecimal valorTotal;
    private TratamentoPagamento tratamentoPagamento;
}
