package com.pure.smile.model;

import java.time.DayOfWeek;
import java.time.LocalDate;

public class DisponibilidadeDentista {
    private Long idDisponibilidade;
    private DayOfWeek dia;
    private LocalDate horaInicio;
    private LocalDate horaFim;
    private boolean ativo = false; // DEFAULT AQUI

    public DisponibilidadeDentista() {
    }

    public DisponibilidadeDentista(Long idDisponibilidade, DayOfWeek dia, LocalDate horaInicio, LocalDate horaFim) {
        this.idDisponibilidade = idDisponibilidade;
        this.dia = dia;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        // ativo já é false por default
    }

    public void ativar(){
        this.ativo = true;
    }

    public void definirHorario(LocalDate horaInicio, LocalDate horaFim){
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
    }
    // Acho que isso está errado, só copieie como está no astah
    public boolean verificarHorario(){
        return this.horaInicio.equals(this.horaInicio) && this.horaFim.equals(this.horaInicio);
    }
}
