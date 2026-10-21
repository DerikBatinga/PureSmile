package com.pure.smile.service;

import com.pure.smile.model.UserModel;
import com.pure.smile.repository.UserRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
 private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public int criar (UserModel u){
        validarCpf(u.getCpf());
        return userRepository.save(u);
    }
    public List<UserModel> listarTodos(){
        return userRepository.readAll();
    }
    public UserModel buscarPorId(Long id){
        try {
            return userRepository.readId(id);
        } catch (EmptyResultDataAccessException e) {
            throw new RegraDeNegocioException("User com ID:" + id+ " não encontrado");
        }
    }
    public int atualizar(UserModel u){
        buscarPorId(u.getIdUser());
        return userRepository.save(u);
    }
    public int deletar(Long id){
      buscarPorId(id);
      return userRepository.delete(id);
    }
    public void validarCpf(String CPF){
        if (CPF.isBlank() || CPF.matches("\\d{11}")){
            throw new RegraDeNegocioException("O CPF "+ CPF + "está vazio ou mal formatado");
        }
    }
}