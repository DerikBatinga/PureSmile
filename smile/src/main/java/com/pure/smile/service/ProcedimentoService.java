package com.pure.smile.service;

import com.pure.smile.model.ProcedimentoModel;
import com.pure.smile.repository.ProcedimentoRepository;
import com.pure.smile.service.exception.RegraDeNegocioException.*;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.math.BigDecimal;

// Aplica regras da aplicação entre a camada HTTP e o acesso ao banco.
@Service // Faz o Spring registrar esta classe para injeção no controller.
public class ProcedimentoService {
    private final ProcedimentoRepository repository;

    // O Spring fornece o repository pelo construtor.
    public ProcedimentoService(ProcedimentoRepository repository) {
        this.repository = repository;
    }

    // Valida antes de gravar e devolve o mesmo objeto com o ID gerado no INSERT.
    public ProcedimentoModel criar(ProcedimentoModel p) {
        validar(p);
        p.setIdProcedimento(repository.saveProcedimento(p));
        return p;
    }

    // A consulta ao banco fica concentrada no repository.
    public List<ProcedimentoModel> listarTodos() {
        return repository.readAll();
    }

    // queryForObject lança EmptyResultDataAccessException quando não há registro.
    // Convertemos isso em uma exceção de domínio, que vira HTTP 404 no handler.
    public ProcedimentoModel buscarPorId(Long id) {
        try {
            return repository.readProcedimento(id);
        } catch (EmptyResultDataAccessException e) {
            throw new RecursoNaoEncontradoException("Procedimento " + id + " não encontrado");
        }
    }

    // Confere se existe, valida os novos dados e mantém o ID recebido na URL.
    public ProcedimentoModel atualizar(Long id, ProcedimentoModel p) {
        buscarPorId(id);
        validar(p);
        p.setIdProcedimento(id);
        repository.updateProcedimento(p);
        return p;
    }

    // Confere a existência antes do DELETE para distinguir ID inexistente.
    public void excluir(Long id) {
        buscarPorId(id);
        repository.deleteProcedimento(id);
    }

    // Defesa adicional à validação do DTO: o service pode ser chamado sem HTTP.
    // compareTo compara o valor decimal sem depender da escala (0 e 0.00 são iguais).
    private void validar(ProcedimentoModel p) {
        if (p.getNome() == null || p.getNome().isBlank() || p.getNome().length() > 150) {
            throw new ValidacaoException("Nome é obrigatório (máximo 150 caracteres)");
        }
        if (p.getValor() == null || p.getValor().compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidacaoException("Valor deve ser maior ou igual a zero");
        }
    }
}
