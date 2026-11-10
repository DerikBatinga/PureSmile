package com.pure.smile.repository;

import com.pure.smile.model.ProcedimentoModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProcedimentoRepository {
    private final JdbcTemplate jdbcTemplate;

    public ProcedimentoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public RowMapper<ProcedimentoModel> rowMapper = (rs, rowNum) -> new ProcedimentoModel(
            rs.getLong("id_procedimento"),
            rs.getString("nome"),
            rs.getString("descricao"),
            rs.getDouble("valor"),
            rs.getLong("id_user")
    );

    public int saveProcedimento(ProcedimentoModel p) {
        String query = "INSERT INTO dbo.Procedimento (nome, descricao, valor, id_user) VALUES (?,?,?,?)";
        return jdbcTemplate.update(query, p.getNome(), p.getDescricao(), p.getValor(), p.getIdUser());
    }
    public List<ProcedimentoModel> readAll(){
        String query = "SELECT * FROM dbo.Procedimento";
        return jdbcTemplate.query(query, rowMapper);
    }
    public List<ProcedimentoModel> readProcedimento(Long id) {
        String query = "SELECT * FROM dbo.Procedimento WHERE id_procedimento = ? ";
        return jdbcTemplate.query(query, rowMapper, id);
    }

    public int updateProcedimento(ProcedimentoModel p) {
        String query = "UPDATE dbo.Procedimento SET nome = ?, descricao = ?, valor = ?, id_user = ?  WHERE id_procedimento = ? ";
        return jdbcTemplate.update(query, p.getNome(), p.getDescricao(), p.getValor(), p.getIdUser());
    }

    public int deleteProcedimento(Long id){
        String query = "DELETE FROM dbo.Procedimento  WHERE id_procedimento = ? ";
        return jdbcTemplate.update(query, id);
    }
}