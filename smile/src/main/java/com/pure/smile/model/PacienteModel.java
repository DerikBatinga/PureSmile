package com.pure.smile.model;

import lombok.*;

import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@NoArgsConstructor
public class PacienteModel extends UserModel {
    private Long idPaciente;
    private String cpf;
    private String sexo;          // aceita NULL
    private String telefone;      // aceita NULL
    private Date dataNasc;   // aceita NULL
    private Long idConvenio;      // aceita NULL (paciente sem convênio)
}
