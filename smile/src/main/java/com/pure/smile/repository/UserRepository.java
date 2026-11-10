package com.pure.smile.repository;

import com.pure.smile.enums.UsuarioRole;
import com.pure.smile.model.UserModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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
            rs.getString("nome"),
            rs.getString("email"),
            rs.getString("senha"),
            rs.getDate("nascimento"),
            UsuarioRole.valueOf(rs.getString("role")),
            rs.getBoolean("ativo"),
            rs.getObject("data_criacao", LocalDateTime.class)
    );

    public int saveUser(UserModel u){
        String query = "INSERT INTO dbo.User(nome, email, nascimento, role, ativo) VALUES( ?, ?, ?, ?)";
        return jdbcTemplate.update(query, u.getNome(), u.getEmail(), u.getDataNasc(), u.getRole());
    }
    public List<UserModel> readAll(){
        String query = "SELECT * FROM dbo.User";
        return jdbcTemplate.query(query, rowMapper);
    }
    public List<UserModel> readUser(Long id){
        String query = "SELECT * FROM dbo.User WHERE id_user = ?";
        return jdbcTemplate.query(query, rowMapper, id);
    }
    public int updateUser(UserModel u){
        String query = "UPDATE dbo.User SET nome = ?, email = ?, nascimento = ?, role = ? WHERE id_user = ?";
        return jdbcTemplate.update(query,u.getNome(), u.getEmail(), u.getDataNasc(), u.getRole(), u.getIdUser());
    }
    public int deleteUser (Long id){
        String query = "DELETE FROM dbo.User WHERE id_user = ?";
        return jdbcTemplate.update(query, id);
    }
}
