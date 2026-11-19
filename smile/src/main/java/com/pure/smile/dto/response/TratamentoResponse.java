package com.pure.smile.dto.response;

import com.pure.smile.model.StatusPagamento;
import com.pure.smile.enums.TratamentoStatus;
import lombok.Data;
import java.time.LocalDateTime;

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

    // ─── CAMPOS DE PAGAMENTO ───
    private double valorTotal;
    private StatusPagamento statusPagamento;
}