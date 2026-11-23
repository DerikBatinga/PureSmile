package com.pure.smile.repository;

import com.pure.smile.model.ProcedimentoModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;

@Repository
public class ProcedimentoRepository {
    private final JdbcTemplate jdbcTemplate;

    public ProcedimentoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ProcedimentoModel> rowMapper = (rs, rowNum) -> new ProcedimentoModel(
            rs.getLong("id_procedimento"),
            rs.getString("nome"),
            rs.getString("descricao"),
            rs.getBigDecimal("valor")
    );

    public Long saveProcedimento(ProcedimentoModel p) {
        String query = "INSERT INTO dbo.Procedimento (nome, descricao, valor) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(query, new String[]{"id_procedimento"});
            ps.setString(1, p.getNome());
            ps.setString(2, p.getDescricao());
            ps.setBigDecimal(3, p.getValor());
            return ps;
        }, keyHolder);
        Number id = keyHolder.getKey();
        if (id == null) {
            throw new IllegalStateException("O banco não retornou o ID do procedimento criado");
        }
        return id.longValue();
    }
    public List<ProcedimentoModel> readAll(){
        String query = "SELECT * FROM dbo.Procedimento";
        return jdbcTemplate.query(query, rowMapper);
    }
    public ProcedimentoModel readProcedimento(Long id) {
        String query = "SELECT * FROM dbo.Procedimento WHERE id_procedimento = ? ";
        return jdbcTemplate.queryForObject(query, rowMapper, id);
    }

    public int updateProcedimento(ProcedimentoModel p) {
        String query = "UPDATE dbo.Procedimento SET nome = ?, descricao = ?, valor = ? WHERE id_procedimento = ?";
        return jdbcTemplate.update(query, p.getNome(), p.getDescricao(), p.getValor(), p.getIdProcedimento());
    }

    public int deleteProcedimento(Long id){
        String query = "DELETE FROM dbo.Procedimento  WHERE id_procedimento = ? ";
        return jdbcTemplate.update(query, id);
    }
}
