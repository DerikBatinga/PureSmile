package com.pure.smile.repository;

import com.pure.smile.enums.UsuarioRole;
import com.pure.smile.model.UserModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
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
            rs.getLong("id_usuario"),
            rs.getString("nome"),
            rs.getString("senha"),
            rs.getString("email"),
            null,
            UsuarioRole.valueOf(rs.getString("role")),
            rs.getBoolean("ativo"),
            rs.getObject("data_criacao", LocalDateTime.class)
    );

    public Long saveUser(UserModel u){
        String query = "INSERT INTO dbo.Usuario (nome, email, senha, role, ativo) VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(query, new String[]{"id_usuario"});
            ps.setString(1, u.getNome());
            ps.setString(2, u.getEmail());
            ps.setString(3, u.getSenha());
            ps.setString(4, u.getRole().name());
            ps.setBoolean(5, true);
            return ps;
        }, keyHolder);

        Number id = keyHolder.getKey();
        if (id == null) {
            throw new IllegalStateException("O banco não retornou o ID do usuário criado");
        }
        return id.longValue();
    }
    public List<UserModel> readAll(){
        String query = "SELECT * FROM dbo.Usuario";
        return jdbcTemplate.query(query, rowMapper);
    }
    public UserModel readUser(Long id){
        String query = "SELECT * FROM dbo.Usuario WHERE id_usuario = ?";
        return jdbcTemplate.queryForObject(query, rowMapper, id);
    }
    public int updateUser(UserModel u){
        String query = "UPDATE dbo.Usuario SET nome = ?, email = ? WHERE id_usuario = ?";
        return jdbcTemplate.update(query, u.getNome(), u.getEmail(), u.getIdUser());
    }
    public int deleteUser (Long id){
        String query = "DELETE FROM dbo.Usuario WHERE id_usuario = ?";
        return jdbcTemplate.update(query, id);
    }
    public int desativar(Long idUser) {
        String sql = "UPDATE dbo.Usuario SET ativo = 0 WHERE id_usuario = ?";
        return jdbcTemplate.update(sql, idUser);
    }

}
