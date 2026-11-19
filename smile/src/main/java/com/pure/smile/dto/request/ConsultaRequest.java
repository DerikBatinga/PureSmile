package com.pure.smile.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConsultaRequest {
    @NotNull(message = "IdPaciente é obrigatório!")
    private Long idPaciente;

    @NotNull(message = "IdDentista é obrigatório!")
    private Long idDentista;

    @NotNull(message = "DataConsulta é obrigatório!")
    @FutureOrPresent(message = "Data da consulta deve ser no presente ou futuro")
    private LocalDateTime dataConsulta;

    @Size(max = 500, message = "Observação deve ter no máximo 500 caracteres")
    private String observacao;
}
