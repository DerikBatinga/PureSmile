package com.pure.smile.model;

import com.pure.smile.enums.ConsultaStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultaModel {
    private Long idConsulta;
    private String observacoes;
    private ConsultaStatus status;
    private LocalDateTime dataConsulta;
    private Long idPaciente;
    private Long idDentista;
}
