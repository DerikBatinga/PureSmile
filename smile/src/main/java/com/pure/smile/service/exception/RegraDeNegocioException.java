package com.pure.smile.service.exception;

// Agrupa os tipos de erro que o service comunica ao handler HTTP.
public class RegraDeNegocioException {

    // Entrada inválida detectada pelas regras de negócio; o handler retorna 400.
    public static class ValidacaoException extends RuntimeException {
        public ValidacaoException(String msg) { super(msg); }
    }
    // Recurso ausente; o handler retorna 404.
    public static class RecursoNaoEncontradoException extends RuntimeException {
        public RecursoNaoEncontradoException(String msg) { super(msg); }
    }
}
