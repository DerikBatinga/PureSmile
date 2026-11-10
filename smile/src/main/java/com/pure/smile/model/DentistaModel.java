package com.pure.smile.model;

import lombok.*;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class DentistaModel extends UserModel{
    private long idDentista;
    private String cro;
    private String telefone;
    private String especialidade;
}
