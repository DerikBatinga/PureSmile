package com.pure.smile.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.pure.smile.service.exception.RegraDeNegocioException.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TratamentoModel {
 private Long idTratamento;
 private String nome;
 private String descricao;
 private String status;
 private LocalDateTime dataInicio;
 private LocalDateTime dataFim;
 private Double pagamento;
 private LocalDateTime dataPagamento;
 private Long idPaciente;

 public boolean isPago() {
  return dataPagamento != null;
 }
 public void pagar() {
  if (isPago()) {
   throw new ValidacaoException("Tratamento já foi pago");
  }
  this.dataPagamento = LocalDateTime.now();
 }
}