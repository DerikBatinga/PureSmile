package com.pure.smile.dto.request;

import com.pure.smile.model.StatusPagamento;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TratamentoRequest {
    @NotBlank(message = "Nome do tratamento é obrigatório!")
    @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
    private String nome;

    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
    private String descricao;

    @NotNull(message = "Data de início é obrigatória!")
    private LocalDateTime dataInicio;

    @NotNull(message = "Data de fim é obrigatória!")
    private LocalDateTime dataFim;

    @NotNull(message = "ID do paciente é obrigatório")
    private Long idPaciente;

    // ─── CAMPOS DE PAGAMENTO ───
    @NotNull(message = "Valor total é obrigatório")
    private double valorTotal;

    @NotNull(message = "Status de pagamento é obrigatório")
    private StatusPagamento statusPagamento;
}