package com.pure.smile.repository;

import com.pure.smile.enums.ConsultaStatus;
import com.pure.smile.model.ConsultaModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.util.List;

public class ConsultaRepository {
    private final JdbcTemplate jdbcTemplate;

    public ConsultaRepository(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;}

    private final RowMapper<ConsultaModel> rowMapper = (rs, rowNum) -> new ConsultaModel(
            rs.getLong("id_consulta"),
            rs.getString("observacoes"),
            ConsultaStatus.valueOf(rs.getString("status")),
            rs.getDate("data_consulta"),
            rs.getLong("id_paciente"),
            rs.getLong("id_dentista")
    );
    public int saveConsulta(ConsultaModel c){
        String query = "INSERT INTO dbo.Consulta (observacoes, status, data_consulta, id_paciente, id_dentista) VALUES(?, ?, ?, ?, ?)";
        return jdbcTemplate.update(query, c.getObservacoes(),c.getStatus(), c.getDataConsulta(), c.getIdPaciente(),c.getIdDentista(), rowMapper);
    }
    public List<ConsultaModel> readAll(){
        String query = "SELECT * FROM dbo.Consulta";
        return jdbcTemplate.query(query, rowMapper);
    }
    public List<ConsultaModel> readConsulta(long id){
        String query = "SELECT * FROM dbo.Consulta WHERE id_consulta = ?";
        return jdbcTemplate.query(query, rowMapper, id);
    }
    public int updateConsulta(ConsultaModel c) {
        String query = "UPDATE dbo.Consulta SET observacoes = ?, status = ?, data_consulta = ? WHERE id_consulta = ?";
        return jdbcTemplate.update(query, c.getObservacoes(), c.getStatus(), c.getDataConsulta(), c.getIdConsulta(), rowMapper);
    }
    public int delete (long id){
        String query = "DELETE FROM dbo.Consulta WHERE id_consulta = ?";
        return jdbcTemplate.update(query, id);
    }
}