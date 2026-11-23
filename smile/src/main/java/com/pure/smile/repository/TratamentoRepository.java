package com.pure.smile.repository;

import com.pure.smile.model.TratamentoModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.time.LocalDateTime;
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
            rs.getObject("data_inicio", LocalDateTime.class),
            rs.getObject("data_fim", LocalDateTime.class),
            rs.getBigDecimal("pagamento"),
            rs.getObject("data_pagamento", LocalDateTime.class),
            rs.getLong("id_paciente")
    );

    public Long saveTratamento(TratamentoModel t){
        String query = "INSERT INTO dbo.Tratamento(nome, descricao, status, data_inicio, data_fim, data_pagamento, id_paciente) VALUES(?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(query, new String[]{"id_tratamento"});
            ps.setString(1, t.getNome());
            ps.setString(2, t.getDescricao());
            ps.setString(3, t.getStatus());
            ps.setObject(4, t.getDataInicio());
            ps.setObject(5, t.getDataFim());
            ps.setObject(6, t.getDataPagamento());
            ps.setLong(7, t.getIdPaciente());
            return ps;
        }, keyHolder);

        Number id = keyHolder.getKey();
        if (id == null) {
            throw new IllegalStateException("O banco não retornou o ID do tratamento criado");
        }
        return id.longValue();
    }
    public List<TratamentoModel> readAll(){
        String query = "SELECT * FROM dbo.Tratamento";
        return jdbcTemplate.query(query, rowMapper);
    }
    public TratamentoModel readTratamento(Long id){
        String query = "SELECT * FROM dbo.Tratamento WHERE id_tratamento = ?";
        return jdbcTemplate.queryForObject(query, rowMapper, id);
    }
    public int updateTratamento(TratamentoModel t){
        String query = "UPDATE dbo.Tratamento SET nome = ?, descricao = ?, status = ?, data_inicio = ?, data_fim = ?, pagamento = ?, data_pagamento = ?, id_paciente = ? WHERE id_paciente = ?";
        return jdbcTemplate.update(query, t.getNome(),t.getDescricao(),t.getStatus(), t.getDataInicio(), t.getDataFim(), t.getPagamento(), t.getDataPagamento(), t.getIdPaciente(),t.getIdPaciente());
    }
    public int deleteTratamento (Long id){
        String query = "DELETE FROM dbo.Tratamento WHERE id_tratamento = ?";
        return jdbcTemplate.update(query, id);
    }

    public int registrarPagamento(Long idTratamento, BigDecimal valorPago, LocalDateTime dataPagamento) {
        String sql = "UPDATE dbo.Tratamento SET data_pagamento = ?, valor_pago = ? "
                + "WHERE id_tratamento = ? AND data_pagamento IS NULL";
        return jdbcTemplate.update(sql, dataPagamento, valorPago, idTratamento);
    }
}
