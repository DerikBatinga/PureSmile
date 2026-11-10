package com.pure.smile.repository;

import com.pure.smile.model.ConvenioModel;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ConvenioRepository {
    //rs – the ResultSet to map (pre-initialized for the current row)
    //rowNum – the number of the current row
    //Lambda, se não conhece pesquise

    private final JdbcTemplate jdbcTemplate;
    public ConvenioRepository(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;} //

    private final RowMapper<ConvenioModel> rowMapper = (rs, rowNum) -> new ConvenioModel(
            rs.getLong("id_convenio"),
            rs.getString("nome"),
            rs.getString("email"),
            rs.getString("telefone"),
            rs.getString("cnpj"),
            rs.getBoolean("ativo"),
            rs.getString("cobertura_descricao")

    );

    public int saveConvenio(ConvenioModel c){
        String query = "INSERT INTO dbo.Convenio(nome, email, telefone, cnpj, cobertura_descricao) VALUES(? , ?, ?, ?, ?, ?);";
        return jdbcTemplate.update(query, c.getIdConvenio(), c.getNome(), c.getEmail(), c.getTelefone(), c.getCnpj(), c.getCoberturaDescricao(), rowMapper);
    }
    public List<ConvenioModel> readAll(){
        String query = "SELECT * FROM dbo.Convenio";
        return jdbcTemplate.query(query, rowMapper);
    }
    public List<ConvenioModel> readConvenio(long id){
        String query = "SELECT * FROM dbo.Convenio WHERE id_convenio = ?";
        return jdbcTemplate.query(query, rowMapper, id);
    }
    public int updateConvenio(ConvenioModel c){
        String query = "UPDATE dbo.Convenio SET nome = ?, email = ?, telefone = ?, cpnj = ?, ativo = ?, cobertura_descricao = ? WHERE id_user = ?";
        return jdbcTemplate.update(query, c.getNome(), c.getEmail(), c.getTelefone(), c.getCnpj(), c.getCoberturaDescricao(), c.getIdConvenio(), rowMapper);
    }
    public int deleteConvenio(long id){
        String query = "DELETE FROM dbo.Convenio WHERE id_convenio = ?";
        return jdbcTemplate.update(query, id);
    }
}