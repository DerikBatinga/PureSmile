package com.pure.smile.repository;

import com.pure.smile.model.ProcedimentoModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;

// Única camada desta API que executa SQL no banco.
@Repository // O Spring registra a classe e injeta o JdbcTemplate configurado.
public class ProcedimentoRepository {
    private final JdbcTemplate jdbcTemplate;

    public ProcedimentoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Converte cada linha do ResultSet em um ProcedimentoModel.
    private final RowMapper<ProcedimentoModel> rowMapper = (rs, rowNum) -> new ProcedimentoModel(
            rs.getLong("id_procedimento"),
            rs.getString("nome"),
            rs.getString("descricao"),
            rs.getBigDecimal("valor")
    );

    // Insere o procedimento e retorna a chave BIGINT gerada pelo SQL Server.
    public Long saveProcedimento(ProcedimentoModel p) {
        String query = "INSERT INTO dbo.Procedimento (nome, descricao, valor) VALUES (?, ?, ?)";
        // O KeyHolder recebe o valor da coluna IDENTITY após o INSERT.
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            // Os ? recebem valores pelo PreparedStatement, sem concatenar entrada ao SQL.
            PreparedStatement ps = connection.prepareStatement(query, new String[]{"id_procedimento"});
            ps.setString(1, p.getNome());
            ps.setString(2, p.getDescricao());
            ps.setBigDecimal(3, p.getValor());
            return ps;
        }, keyHolder);
        Number id = keyHolder.getKey();
        // Sem chave gerada, não é seguro informar ao cliente que a criação terminou.
        if (id == null) {
            throw new IllegalStateException("O banco não retornou o ID do procedimento criado");
        }
        return id.longValue();
    }
    // query executa SELECT de várias linhas usando o RowMapper acima.
    public List<ProcedimentoModel> readAll(){
        String query = "SELECT * FROM dbo.Procedimento";
        return jdbcTemplate.query(query, rowMapper);
    }
    // queryForObject espera uma linha; se não encontrar, lança exceção ao service.
    public ProcedimentoModel readProcedimento(Long id) {
        String query = "SELECT * FROM dbo.Procedimento WHERE id_procedimento = ? ";
        return jdbcTemplate.queryForObject(query, rowMapper, id);
    }

    // update devolve a quantidade de linhas alteradas (normalmente 1).
    public int updateProcedimento(ProcedimentoModel p) {
        String query = "UPDATE dbo.Procedimento SET nome = ?, descricao = ?, valor = ? WHERE id_procedimento = ?";
        return jdbcTemplate.update(query, p.getNome(), p.getDescricao(), p.getValor(), p.getIdProcedimento());
    }

    // Também devolve a quantidade de linhas excluídas.
    public int deleteProcedimento(Long id){
        String query = "DELETE FROM dbo.Procedimento  WHERE id_procedimento = ? ";
        return jdbcTemplate.update(query, id);
    }
}
