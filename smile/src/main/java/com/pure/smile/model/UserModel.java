package com.pure.smile.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data               //Gera Getters e Se
@NoArgsConstructor  //Criar constructor JDBC vazio
@AllArgsConstructor //Coloca todos atributos dento do construtor
public class UserModel { //Não precisar ser o mesmo nome do bd
     private Long idUser;
     private String firstName;
     private String secondName;
     private String cpf;
     private String gender;
     private Date birthday;
     private String email;
}