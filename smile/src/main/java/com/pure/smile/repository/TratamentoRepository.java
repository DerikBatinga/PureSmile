package com.pure.smile.repository;

import com.pure.smile.model.TratamentoModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TratamentoRepository {
    private final JdbcTemplate jdbcTemplate;

    public TratamentoRepository(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;}

    public RowMapper <TratamentoModel> rowMapper = (rs, rowNum) -> new TratamentoModel(
            rs.getLong("id_tratamento"),
            rs.getString("nome"),
            rs.getString("descricao"),
            rs.getString("status"),
            rs.getDate("data_inicio"),
            rs.getDate("data_fim"),
            rs.getLong("id_paciente")
    );

    public int saveTratamento(TratamentoModel t){
        String query = "INSERT INTO dbo.Tratamento(nome, descricao, status, data_fim, id_paciente) VALUES( ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(query, t.getNome(), t.getDescricao(), t.getStatus(), t.getData_fim(), t.getIdPaciente());
    }
    public List<TratamentoModel> readAll(){
        String query = "SELECT * FROM dbo.Tratamento";
        return jdbcTemplate.query(query, rowMapper);
    }
    public List<TratamentoModel> readTratamento(Long id){
        String query = "SELECT * FROM dbo.Tratamento WHERE id_tratamento = ?";
        return jdbcTemplate.query(query, rowMapper, id);
    }
    public int updateTratamento(TratamentoModel t){
        String query = "UPDATE dbo.Tratamento SET nome = ?, descricao = ?, status = ?, data_fim = ?, id_paciente = ? WHERE id_paciente = ?";
        return jdbcTemplate.update(query, t.getNome(),t.getDescricao(),t.getStatus(),t.getData_fim(),t.getIdPaciente(),t.getIdPaciente());
    }
    public int deleteTratamento (Long id){
        String query = "DELETE FROM dbo.Tratamento WHERE id_tratamento = ?";
        return jdbcTemplate.update(query, id);
    }
}
