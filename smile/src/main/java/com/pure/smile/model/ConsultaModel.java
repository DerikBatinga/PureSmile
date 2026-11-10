package com.pure.smile.model;

import com.pure.smile.enums.ConsultaStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultaModel {
    private long idConsulta;
    private String observacoes;
    private ConsultaStatus status;
    private Date dataConsulta;
    private long idPaciente;
    private long idDentista;
}
