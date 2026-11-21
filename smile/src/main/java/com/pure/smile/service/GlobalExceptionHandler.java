package com.pure.smile.service;

import com.pure.smile.service.exception.RegraDeNegocioException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.pure.smile.service.exception.RegraDeNegocioException.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RegraDeNegocioException.ValidacaoException.class)
    public ResponseEntity<String> validacao(ValidacaoException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<String> naoEncontrado(RecursoNaoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> integridade(DataIntegrityViolationException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Operação conflita com dados existentes");
    }
}
