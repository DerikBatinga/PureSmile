package com.pure.smile.service;

import com.pure.smile.service.exception.RegraDeNegocioException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import com.pure.smile.service.exception.RegraDeNegocioException.*;

// Trata exceções lançadas pelos controllers e produz respostas HTTP consistentes.
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Falha nas anotações @Valid do DTO: retorna a primeira mensagem com HTTP 400.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> entradaInvalida(MethodArgumentNotValidException e) {
        String mensagem = e.getBindingResult().getFieldErrors().stream()
                .map(erro -> erro.getDefaultMessage())
                .findFirst().orElse("Dados inválidos");
        return ResponseEntity.badRequest().body(mensagem);
    }

    // Falha nas regras verificadas pelo service: HTTP 400 Bad Request.
    @ExceptionHandler(RegraDeNegocioException.ValidacaoException.class)
    public ResponseEntity<String> validacao(ValidacaoException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    // ID que não existe no banco: HTTP 404 Not Found.
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<String> naoEncontrado(RecursoNaoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    // Violação de restrição do banco, como um registro ainda referenciado: HTTP 409.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> integridade(DataIntegrityViolationException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Operação conflita com dados existentes");
    }
}
