package com.pure.smile.service.exception;

public class RegraDeNegocioException {

    public static class ValidacaoException extends RuntimeException {
        public ValidacaoException(String msg) { super(msg); }
    }
    public static class RecursoNaoEncontradoException extends RuntimeException {
        public RecursoNaoEncontradoException(String msg) { super(msg); }
    }
}
