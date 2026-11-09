package com.pure.smile.model;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class DisponibilidadeDentista {
    private Long idDisponibilidade;
    private DayOfWeek dia;
    private LocalTime horaInicio;
    private LocalTime horaFim;
    private boolean ativo = false; // DEFAULT AQUI

    public DisponibilidadeDentista() {
    }

    public DisponibilidadeDentista(Long idDisponibilidade, DayOfWeek dia, LocalTime horaInicio, LocalTime horaFim) {
        this.idDisponibilidade = idDisponibilidade;
        this.dia = dia;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        // ativo já é false por default
    }

    public void ativar() { this.ativo = true; }
    public void desativar() { this.ativo = false; }

    public void definirHorario(LocalTime horaInicio, LocalTime horaFim){
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
    }

    public boolean verificarHorario(LocalTime horario) {
        return !horario.isBefore(horaInicio) && !horario.isAfter(horaFim);
    }
}
