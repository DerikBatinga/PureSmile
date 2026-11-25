package com.pure.smile.dto.response;

import com.pure.smile.enums.ConsultaStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConsultaResponse {
    private Long idConsulta;
    private Long idPaciente;
    private Long idDentista;
    private LocalDateTime dataConsulta;
    private ConsultaStatus status;
    private String observacao;
}
