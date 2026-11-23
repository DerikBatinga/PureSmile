package com.pure.smile.service;

import com.pure.smile.model.DentistaModel;
import com.pure.smile.enums.UsuarioRole;
import com.pure.smile.repository.DentistaRepository;
import com.pure.smile.repository.UserRepository;
import com.pure.smile.service.exception.RegraDeNegocioException.*;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DentistaService {
    private final DentistaRepository dentistaRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DentistaService(DentistaRepository dentistaRepository,
                           UserRepository usuarioRepository,
                           PasswordEncoder passwordEncoder) {
        this.dentistaRepository = dentistaRepository;
        this.userRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void criar(DentistaModel d) {
        if (d.getSenha() == null || d.getSenha().isBlank()) {
            throw new ValidacaoException("Senha é obrigatória");
        }
        validar(d);
        d.setRole(UsuarioRole.DENTISTA);
        d.setSenha(passwordEncoder.encode(d.getSenha()));
        Long idUsuario = userRepository.saveUser(d);
        dentistaRepository.saveDentista(idUsuario, d);
    }

    public List<DentistaModel> listarTodos() {
        return dentistaRepository.readAll();
    }

    public DentistaModel buscarPorId(Long id) {
        try {
            return dentistaRepository.readId(id);
        } catch (EmptyResultDataAccessException e) {
            throw new RecursoNaoEncontradoException("Dentista " + id + " não encontrado");
        }
    }

    @Transactional
    public void atualizar(Long id, DentistaModel d) {
        DentistaModel atual = buscarPorId(id);
        validar(d);
        d.setIdDentista(id);
        d.setIdUser(atual.getIdUser());
        userRepository.updateUser(d);
        dentistaRepository.updateDentista(d);
    }

    public void desativar(Long id) {
        userRepository.desativar(buscarPorId(id).getIdUser());
    }

    private void validar(DentistaModel d) {
        if (d.getNome() == null || d.getNome().isBlank()) {
            throw new ValidacaoException("Nome é obrigatório");
        }
        if (d.getEmail() == null || !d.getEmail().matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            throw new ValidacaoException("E-mail inválido");
        }
        if (d.getCro() == null || d.getCro().isBlank() || d.getCro().length() > 30) {
            throw new ValidacaoException("CRO é obrigatório (máximo 30 caracteres)");
        }
    }
}
