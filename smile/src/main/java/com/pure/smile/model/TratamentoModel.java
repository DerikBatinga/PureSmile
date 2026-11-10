package com.pure.smile.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TratamentoModel {
 private long idTratamento;
 private String nome;
 private String descricao;
 private String status;
 private Date data_inicio;
 private Date data_fim;
 private long idPaciente;
}