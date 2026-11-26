package com.pure.smile.service;

import com.pure.smile.model.ConvenioModel;
import com.pure.smile.repository.ConvenioRepository;
import com.pure.smile.service.exception.RegraDeNegocioException.*;
import org.springframework.stereotype.Service;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ConvenioService {
    private final ConvenioRepository convenioRepository;

    public ConvenioService(ConvenioRepository convenioRepository) {
        this.convenioRepository = convenioRepository;
    }

    @Transactional
    public void criar(ConvenioModel c){
      if (c.getNome() == null || c.getNome().isBlank()) {
        throw new RecursoNaoEncontradoException("Nome inválido");
      }
      validar(c);
      convenioRepository.saveConvenio(c);
    }

    public List<ConvenioModel> listarTodos() { return convenioRepository.readAll(); }

    public ConvenioModel buscarPorId(Long id){
        try {
         return convenioRepository.readConvenio(id);
        } catch (EmptyResultDataAccessException e) {
            throw new RecursoNaoEncontradoException("Convênio " + id + " não encontrado");
        }
    }
    @Transactional
    public void atualizar(ConvenioModel c) {
        validar(c);
        convenioRepository.updateConvenio(c);
    }

    public void desativar (Long id){
        convenioRepository.desativar(buscarPorId(id).getIdConvenio());
    }

    public void validar(ConvenioModel c){
        if (c.getCnpj() != null && !c.getCnpj().matches("\\d{14}")) {
            throw new ValidacaoException("CNPJ inválido!, verifique se digitou corretamente");
        }
    }
}
