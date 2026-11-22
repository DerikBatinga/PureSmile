package com.pure.smile.service;

import com.pure.smile.model.PacienteModel;
import com.pure.smile.repository.PacienteRepository;
import com.pure.smile.repository.UserRepository;
import com.pure.smile.service.exception.RegraDeNegocioException.*;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PacienteService {
    private final UserRepository userRepository;
    private final PacienteRepository pacienteRepository;
    private final ConvenioService convenioService;
    private final PasswordEncoder passwordEncoder;

    public PacienteService(UserRepository userRepository, PacienteRepository pacienteRepository, ConvenioService convenioService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.pacienteRepository = pacienteRepository;
        this.convenioService = convenioService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void criar(PacienteModel p){
        if(p.getSenha().isEmpty()){
            throw new ValidacaoException("Uma Senha é obrigatória");
        }
        validar(p);
        p.setSenha(passwordEncoder.passwordEncoder(p.getSenha()));
        Long idUsuario = userRepository.saveUser(p);
        pacienteRepository.savePaciente(idUsuario, p);
    }

    public List<PacienteModel> listarTodos() { return pacienteRepository.readAll(); }

    public PacienteModel buscarPorId (Long id){
        try {
            return pacienteRepository.readId(id);
        }catch (EmptyResultDataAccessException e){
            throw new RecursoNaoEncontradoException("id:"+ id +"não encontrado");
        }
    }

    @Transactional
    public void atualizar(Long id, PacienteModel p) {
        PacienteModel atual = buscarPorId(id);
        validar(p);
        p.setIdPaciente(id);
        p.setIdUser(atual.getIdUser());
        userRepository.updateUser(p);
        pacienteRepository.updatePaciente(p);
    }

    public void desativar(Long id) {
        userRepository.desativar(buscarPorId(id).getIdUser());
    }

    public void validar(PacienteModel p){
        if (p.getCpf().isEmpty() || p.getCpf().matches("\\d{11}")){
            throw new ValidacaoException("CPF:"+p.getCpf()+"não é válido");
        }
        if (p.getIdConvenio() != null){
            try {
             convenioService.buscarPorId(p.getIdConvenio());
            }catch (RecursoNaoEncontradoException e){
                throw new ValidacaoException("Convenio não encontrado");
            }
        }
    }
}
