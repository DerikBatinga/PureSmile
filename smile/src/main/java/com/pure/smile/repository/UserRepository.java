package com.pure.smile.repository;

import com.pure.smile.model.UserModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepository {
    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    //rs – the ResultSet to map (pre-initialized for the current row)
    //rowNum – the number of the current row
    //Lambda, se não conhece pesquise

    private final RowMapper <UserModel> rowMapper = (rs, rowNum) -> new UserModel( //Precisa ter mesmo nome do bd
     rs.getLong("id_user"),
            rs.getString("first_name"),
            rs.getString("second_name"),
            rs.getString("cpf"),
            rs.getString("gender"),
            rs.getDate("birthday"),
            rs.getString("email")
    );

    public int save(UserModel u){
         String query = "INSERT INTO tb_user(first_name, second_name, cpf, gender, birthday, email) VALUES( ?, ?, ?, ?, ?, ?)";
         return jdbcTemplate.update(query, u.getFirstName(), u.getSecondName(), u.getCpf(), u.getGender(), u.getBirthday(), u.getEmail());
    }
    public List<UserModel> readAll(){
        String query = "SELECT * FROM tb_user";
        return jdbcTemplate.query(query, rowMapper);
    }
    public List<UserModel> readId(Long id){
        String query = "SELECT * FROM tb_user WHERE id_user = ?";
        return jdbcTemplate.query(query, rowMapper, id);
    }
    public int update(UserModel u){
        String query = "UPDATE tb_user SET first_name = ?, second_name = ?, cpf = ?, gender = ?, birthday = ?, email = ? WHERE id_user = ?";
        return jdbcTemplate.update(query, u.getFirstName(),u.getSecondName(),u.getCpf(),u.getGender(),u.getBirthday(),u.getEmail(),u.getIdUser());
    }
    public int delete (Long id){
        String query = "DELETE FROM tb_user WHERE id_user = ?";
        return jdbcTemplate.update(query, id);
    }
}
