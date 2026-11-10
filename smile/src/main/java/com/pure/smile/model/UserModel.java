package com.pure.smile.model;

import com.pure.smile.enums.UsuarioRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data               //Gera Getters e Se
@NoArgsConstructor  //Criar constructor JDBC vazio
@AllArgsConstructor //Coloca todos atributos dento do construtor
public class UserModel { //Não precisar de ser o mesmo nome do bd
     private Long idUser;
     private String nome;
     private String email;
     private String senha;
     private Date dataNasc;
     private UsuarioRole role;
     private boolean ativo;
     private LocalDateTime dataCriacao;
}