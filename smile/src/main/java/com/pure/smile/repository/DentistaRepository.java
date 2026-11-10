package com.pure.smile.repository;

import com.pure.smile.enums.UsuarioRole;
import com.pure.smile.model.DentistaModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDateTime;

@Repository
public class DentistaRepository {
    private final JdbcTemplate jdbcTemplate;

    public DentistaRepository(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;}

    final static String SQL_JOIN = """
    SELECT u.id_usuario, u.nome, u.email, u.role, u.ativo, u.data_criacao,
           d.id_dentista, d.cro, d.telefone, d.especialidade
    FROM dbo.Dentista d
    JOIN dbo.Usuario u ON u.id_usuario = d.id_usuario
    """;

    RowMapper<DentistaModel> rowMapper = (rs, rowNum) -> {
        DentistaModel d = new DentistaModel();
        d.setIdUser(rs.getLong("id_user"));
        d.setNome(rs.getString("nome"));
        d.setEmail(rs.getString("email"));
        d.setRole(UsuarioRole.valueOf(rs.getString("role")));
        d.setAtivo(rs.getBoolean("ativo"));
        d.setDataCriacao(rs.getObject("data_criacao", LocalDateTime.class));
        d.setIdDentista(rs.getLong("id_dentista"));
        d.setCro(rs.getString("cro"));
        d.setTelefone(rs.getString("telefone"));
        d.setEspecialidade(rs.getString("especialidade"));
        return d;
    };

    public int saveDentista(Long idUser, DentistaModel d) {
        String sql = "INSERT INTO dbo.Dentista (id_user, cro, telefone, especialidade) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, idUser, d.getCro(), d.getTelefone(), d.getEspecialidade());
    }
    public DentistaModel readId(Long id) {
        // o mesmo SELECT com JOIN, terminando em: WHERE d.id_dentista = ?
        return jdbcTemplate.queryForObject(SQL_JOIN + " WHERE d.id_dentista = ?", rowMapper, id);
    }
    public int updateDentista(DentistaModel d) {
        String sql = "UPDATE dbo.Dentista SET cro = ?, telefone = ?, especialidade = ? WHERE id_dentista = ?";
        return jdbcTemplate.update(sql, d.getCro(), d.getTelefone(), d.getEspecialidade(), d.getIdDentista());
    }
}
