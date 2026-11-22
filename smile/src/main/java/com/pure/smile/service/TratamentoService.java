package com.pure.smile.service;

import com.pure.smile.enums.TratamentoStatus;
import com.pure.smile.model.TratamentoModel;
import com.pure.smile.repository.TratamentoRepository;
import com.pure.smile.service.exception.RegraDeNegocioException.*;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TratamentoService {
    private final TratamentoRepository tratamentoRepository;
    private final PacienteService pacienteService;
    private final ProcedimentoService procedimentoService;

    public TratamentoService(TratamentoRepository tratamentoRepository,
                             PacienteService pacienteService,
                             ProcedimentoService procedimentoService) {
        this.tratamentoRepository = tratamentoRepository;
        this.pacienteService = pacienteService;
        this.procedimentoService = procedimentoService;
    }

    @Transactional
    public Long criar(TratamentoModel t) {
        validar(t);
        if (t.getStatus() == null) {
            t.setStatus(TratamentoStatus.AGENDADO.toString());
        }
        Long id = tratamentoRepository.saveTratamento(t);
        return id;
    }
   public List<TratamentoModel> listarTodos() {
        return tratamentoRepository.readAll();
    }

    public TratamentoModel buscarPorId(Long id) {
        TratamentoModel t;
        try {
            t = tratamentoRepository.readTratamento(id);
        } catch (EmptyResultDataAccessException e) {
            throw new RecursoNaoEncontradoException("Tratamento " + id + " não encontrado");
        }
        return t;
    }

    public void atualizar(Long id, TratamentoModel t) {
        exigirNaoPago(buscarPorId(id));
        validar(t);
        t.setIdTratamento(id);
        tratamentoRepository.updateTratamento(t);   // o UPDATE NÃO pode tocar em data_pagamento/valor_pago
    }

    @Transactional
    public void excluir(Long id) {
        exigirNaoPago(buscarPorId(id));
        tratamentoRepository.deleteTratamento(id);
    }

    @Transactional
    public TratamentoModel pagar(Long id) {
        TratamentoModel t = buscarPorId(id);
        if (t.getStatus() != TratamentoStatus.FINALIZADO.toString())
            throw new ValidacaoException("Só é possível pagar tratamento CONCLUIDO");

        t.pagar();
        int linhas = tratamentoRepository.registrarPagamento(id, t.getPagamento(), t.getDataPagamento());
        if (linhas == 0) {
            throw new ValidacaoException("Tratamento já foi pago");
        }
        return t;
    }

    private void exigirNaoPago(TratamentoModel t) {
        if (t.isPago()) {
            throw new ValidacaoException("Tratamento já pago não pode ser alterado");
        }
    }

    private void validar(TratamentoModel t) {
        if (t.getNome() == null || t.getNome().isBlank() || t.getNome().length() > 150) {
            throw new ValidacaoException("Nome é obrigatório (máximo 150 caracteres)");
        }
        if (t.getIdPaciente() == null) {
            throw new ValidacaoException("Paciente é obrigatório");
        }
        try {
            pacienteService.buscarPorId(t.getIdPaciente());
        } catch (RecursoNaoEncontradoException e) {
            throw new ValidacaoException("Paciente " + t.getIdPaciente() + " não existe");
        }
        if (t.getDataInicio() != null && t.getDataFim() != null
                && t.getDataFim().isBefore(t.getDataInicio())) {
            throw new ValidacaoException("Data de fim não pode ser anterior à data de início");
        }
    }
}