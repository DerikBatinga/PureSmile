package com.pure.smile.service;

import com.pure.smile.model.ConsultaModel;
import com.pure.smile.model.DentistaModel;
import com.pure.smile.model.PacienteModel;
import com.pure.smile.enums.ConsultaStatus;
import com.pure.smile.repository.ConsultaRepository;
import com.pure.smile.service.exception.RegraDeNegocioException.*;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConsultaService {
    private final ConsultaRepository consultaRepository;
    private final PacienteService pacienteService;
    private final DentistaService dentistaService;

    public ConsultaService(ConsultaRepository consultaRepository,
                           PacienteService pacienteService,
                           DentistaService dentistaService) {
        this.consultaRepository = consultaRepository;
        this.pacienteService = pacienteService;
        this.dentistaService = dentistaService;
    }

    public void agendar(ConsultaModel c) {
        validar(c, 0L);                         // 0 = nenhuma consulta a ignorar no teste de conflito
        c.setStatus(ConsultaStatus.AGENDADO);   // toda consulta nasce AGENDADA, ignora o que veio no JSON
        consultaRepository.saveConsulta(c);
    }

    public List<ConsultaModel> listarTodos() {
        return consultaRepository.readAll();
    }

    public ConsultaModel buscarPorId(Long id) {
        try {
            return consultaRepository.readConsulta(id);
        } catch (EmptyResultDataAccessException e) {
            throw new RecursoNaoEncontradoException("Consulta " + id + " não encontrada");
        }
    }

    // Remarcar / editar: só enquanto AGENDADA. Exige data futura de novo.
    public void atualizar(Long id, ConsultaModel c) {
        ConsultaModel atual = buscarPorId(id);
        exigirAgendada(atual);
        validar(c, id);                         // ignora a própria consulta no teste de conflito
        c.setIdConsulta(id);
        consultaRepository.updateConsulta(c);
    }

    public void alterarStatus(Long id, ConsultaStatus novo) {
        ConsultaModel atual = buscarPorId(id);
        exigirAgendada(atual);
        if (novo != ConsultaStatus.FINALIZADO && novo != ConsultaStatus.CANCELADO) {
            throw new ValidacaoException("Novo status deve ser REALIZADA ou CANCELADA");
        }
        consultaRepository.updateStatus(id, novo);
    }

    private void exigirAgendada(ConsultaModel c) {
        if (c.getStatus() != ConsultaStatus.AGENDADO) {
            throw new ValidacaoException("Consulta " + c.getStatus() + " não pode mais ser alterada");
        }
    }

    private void validar(ConsultaModel c, Long idIgnorar) {
        if (c.getDataConsulta() == null || !c.getDataConsulta().isAfter(LocalDateTime.now())) {
            throw new ValidacaoException("Data e hora devem estar no futuro");
        }
        validarPaciente(c.getIdPaciente());
        validarDentista(c.getIdDentista());
        if (consultaRepository.existeConflito(c.getIdDentista(), c.getDataConsulta(), idIgnorar)) {
            throw new ValidacaoException("O dentista já tem consulta nesse horário");
        }
    }

    private void validarPaciente(Long id) {
        if (id == null) {
            throw new ValidacaoException("Paciente é obrigatório");
        }
        PacienteModel p;
        try {
            p = pacienteService.buscarPorId(id);
        } catch (RecursoNaoEncontradoException e) {
            throw new ValidacaoException("Paciente " + id + " não existe");
        }
        if (!p.isAtivo()) {
            throw new ValidacaoException("Paciente " + id + " está inativo");
        }
    }

    private void validarDentista(Long id) {
        if (id == null) {
            throw new ValidacaoException("Dentista é obrigatório");
        }
        DentistaModel d;
        try {
            d = dentistaService.buscarPorId(id);
        } catch (RecursoNaoEncontradoException e) {
            throw new ValidacaoException("Dentista " + id + " não existe");
        }
        if (!d.isAtivo()) {
            throw new ValidacaoException("Dentista " + id + " está inativo");
        }
    }
}