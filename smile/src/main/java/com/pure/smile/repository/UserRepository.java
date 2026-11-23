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
            rs.getLong("id_user"),
            rs.getString("nome"),
            rs.getString("email"),
            rs.getString("senha"),
            rs.getDate("nascimento"),
            UsuarioRole.valueOf(rs.getString("role")),
            rs.getBoolean("ativo"),
            rs.getObject("data_criacao", LocalDateTime.class)
    );

    public Long saveUser(UserModel u){
        String query = "INSERT INTO dbo.[User] (nome, email, senha, nascimento, role, ativo) VALUES (?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(query, new String[]{"id_user"});
            ps.setString(1, u.getNome());
            ps.setString(2, u.getEmail());
            ps.setString(3, u.getSenha());
            ps.setDate(4, u.getDataNasc() == null ? null : new java.sql.Date(u.getDataNasc().getTime()));
            ps.setString(5, u.getRole().name());
            ps.setBoolean(6, u.isAtivo());
            return ps;
        }, keyHolder);

        Number id = keyHolder.getKey();
        if (id == null) {
            throw new IllegalStateException("O banco não retornou o ID do usuário criado");
        }
        return id.longValue();
    }
    public List<UserModel> readAll(){
        String query = "SELECT * FROM dbo.User";
        return jdbcTemplate.query(query, rowMapper);
    }
    public UserModel readUser(Long id){
        String query = "SELECT * FROM dbo.User WHERE id_user = ?";
        return jdbcTemplate.queryForObject(query, rowMapper, id);
    }
    public int updateUser(UserModel u){
        String query = "UPDATE dbo.User SET nome = ?, email = ?, nascimento = ?, role = ? WHERE id_user = ?";
        return jdbcTemplate.update(query,u.getNome(), u.getEmail(), u.getDataNasc(), u.getRole(), u.getIdUser());
    }
    public int deleteUser (Long id){
        String query = "DELETE FROM dbo.User WHERE id_user = ?";
        return jdbcTemplate.update(query, id);
    }
    public int desativar(Long idUser) {
        String sql = "UPDATE dbo.Usuario SET ativo = 0 WHERE id_usuario = ?";
        return jdbcTemplate.update(sql, idUser);
    }

}
