package com.pure.smile.model;

public class Pagamento {
    private Long idPagamento;
    private Long idConsulta;
    private double valor;
    private StatusPagamento statusPagamento = StatusPagamento.PENDENTE; // DEFAULT AQUI

    public Pagamento() {}

    public Pagamento(Long idPagamento, Long idConsulta, double valor) {
        this.idPagamento = idPagamento;
        this.idConsulta = idConsulta;
        this.valor = valor;
        // statusPagamento já é PENDENTE por default
    }

    // Chamou este metodo? Vira PAGO. Não chamou? Continua PENDENTE.
    public void registrarPagamento() {
        this.statusPagamento = StatusPagamento.PAGO;
    }

    public enum StatusPagamento {
        PENDENTE,
        PAGO
    }
}