package com.pure.smile.service;

import com.pure.smile.model.ProcedimentoModel;
import com.pure.smile.repository.ProcedimentoRepository;
import com.pure.smile.service.exception.RegraDeNegocioException.*;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProcedimentoService {
    private final ProcedimentoRepository repository;

    public ProcedimentoService(ProcedimentoRepository repository) {
        this.repository = repository;
    }

    public void criar(ProcedimentoModel p) {
        validar(p);
        repository.saveProcedimento(p);
    }

    public List<ProcedimentoModel> listarTodos() {
        return repository.readAll();
    }

    public ProcedimentoModel buscarPorId(Long id) {
        try {
            return repository.readProcedimento(id);
        } catch (EmptyResultDataAccessException e) {
            throw new RecursoNaoEncontradoException("Procedimento " + id + " não encontrado");
        }
    }

    public void atualizar(Long id, ProcedimentoModel p) {
        buscarPorId(id);
        validar(p);
        p.setIdProcedimento(id);
        repository.updateProcedimento(p);
    }

    public void excluir(Long id) {
        buscarPorId(id);
        repository.deleteProcedimento(id);
    }

    private void validar(ProcedimentoModel p) {
        if (p.getNome() == null || p.getNome().isBlank() || p.getNome().length() > 150) {
            throw new ValidacaoException("Nome é obrigatório (máximo 150 caracteres)");
        }
        if (p.getValor() == null || p.getValor() < 0) {
            throw new ValidacaoException("Valor deve ser maior ou igual a zero");
        }
    }
}