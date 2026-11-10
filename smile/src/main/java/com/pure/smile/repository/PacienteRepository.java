package com.pure.smile.repository;

import com.pure.smile.enums.UsuarioRole;
import com.pure.smile.model.PacienteModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public class PacienteRepository {
    private final JdbcTemplate jdbcTemplate;

    public PacienteRepository(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;}


    final static String SQL_JOIN = """
SELECT u.id_usuario, u.nome, u.email, u.ativo, u.data_criacao,
       p.id_paciente, p.cpf, p.sexo, p.telefone, p.data_nasc, p.id_convenio
FROM dbo.Paciente p
JOIN dbo.Usuario u ON u.id_usuario = p.id_usuario
    """;

    RowMapper<PacienteModel> rowMapper = (rs, rowNum) -> {
        PacienteModel p = new PacienteModel();
        p.setIdUser(rs.getLong("id_user"));
        p.setNome(rs.getString("nome"));
        p.setEmail(rs.getString("email"));
        p.setRole(UsuarioRole.valueOf(rs.getString("role")));
        p.setAtivo(rs.getBoolean("ativo"));
        p.setDataCriacao(rs.getObject("data_criacao", LocalDateTime.class));
        p.setIdPaciente(rs.getLong("id_paciente"));
        p.setCpf(rs.getString("cpf"));
        p.setSexo(rs.getString("sexo"));
        p.setTelefone(rs.getString("telefone"));
        p.setDataNasc(rs.getDate("data_nasc"));
        p.setIdConvenio(rs.getObject("id_convenio", Long.class));   // não use getLong: NULL viraria 0
        return p;
    };

    public int savePaciente(Long idUser, PacienteModel p) {
        String sql = "INSERT INTO dbo.Paciente (id_usuario, cpf, sexo, telefone, data_nasc, id_convenio) VALUES (?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, idUser);
    }
    public PacienteModel readId(Long id) {
        // o mesmo SELECT com JOIN, terminando em: WHERE d.id_dentista = ?
        return jdbcTemplate.queryForObject(SQL_JOIN + " WHERE p.id_paciente = ?", rowMapper, id);
    }
    public int updateDentista(PacienteModel d) {
        String sql = "UPDATE dbo.Paciente SET cpf = ?, sexo = ?, telefone = ?, data_nasc = ?, id_convenio = ? WHERE id_paciente = ?";
        return jdbcTemplate.update(sql, d.getCpf(), d.getSexo(), d.getTelefone(), d.getDataNasc(), d.getIdConvenio());
    }
}
