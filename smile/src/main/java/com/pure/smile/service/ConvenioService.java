package com.pure.smile.service;

import com.pure.smile.model.ConvenioModel;
import com.pure.smile.repository.ConvenioRepository;
import com.pure.smile.service.exception.RegraDeNegocioException.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ConvenioService {
    private ConvenioRepository convenioRepository;

    @Transactional
    public void criar(ConvenioModel c){
      if (c.getNome().isEmpty()){
        throw new RecursoNaoEncontradoException("Nome inválido");
      }
      validar(c);
      convenioRepository.saveConvenio(c);
    }

    public List<ConvenioModel> listarTodos() { return convenioRepository.readAll(); }

    public ConvenioModel buscarPorId(Long id){
        try {
         return convenioRepository.readConvenio(id);
        }catch (RecursoNaoEncontradoException e){
            throw new ValidacaoException("id:" +id+ "não encontrado");
        }
    }
    @Transactional
    public void atualizar(ConvenioModel c) {
        validar(c);
        convenioRepository.updateConvenio(c);
    }

    public void desativar (Long id){convenioRepository.desativar(buscarPorId(id).getIdConvenio());}
    public void validar(ConvenioModel c){
        if (c.getCnpj().isEmpty() || c.getCnpj().matches("\\d{11}")){
            throw new ValidacaoException("CNPJ inválido!, verifique se digitou corretamente");
        }
    }
}
