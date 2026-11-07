package com.pure.smile.model;

import java.time.LocalDateTime;

public class Usuario {
    private Long idUsuario;
    private String nomeCompleto;
    private String cpf;
    private String email;
    private String senhaHash;
    private String telefone;
    private LocalDateTime dataNascimento;
    private boolean status;
    private Role role;

    public void Usuario() {
    }

    public void Usuario(Long idUsuario, String nomeCompleto, String cpf, String email, String senhaHash, String telefone, LocalDateTime dataNascimento, boolean status, Role role) {
        this.idUsuario = idUsuario;
        this.nomeCompleto = nomeCompleto;
        this.cpf = cpf;
        this.email = email;
        this.senhaHash = senhaHash;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.status = status;
        this.role = role;
    }

    public enum Role {
        PACIENTE,
        DENTISTA,
        ADMINISTRADOR
    }

    public boolean validarLogin(String email, String senha){
        return this.email.equals(email) && this.senhaHash.equals(senha);
    }

    public void ativar(){
        this.status = true;
    }

    public void desativar(){
        this.status = false;
    }

    public void atualizarDados(String nomeCompleto, String cpf, String email, String senhaHash, String telefone, LocalDateTime dataNascimento){
        this.nomeCompleto = nomeCompleto;
        this.cpf = cpf;
        this.email = email;
        this.senhaHash = senhaHash;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
    }
}
