/* =====================================================================
   HEALTHCONTROLLER — provar que o backend fala com o SQL Server.
   ---------------------------------------------------------------------
   Ao abrir http://localhost:8080/api/health no navegador, o Java roda
   um SELECT de verdade no banco e devolve um JSON com o resultado.
   Se aparecer a versão do SQL Server, Java <-> Banco está CONECTADO.
   ===================================================================== */

/* package: declara em qual "pasta lógica" o arquivo vive (obrigatório).
   É ela que permite a classe ser enxergada pelo Spring. */
package com.pure.smile;

/* ----------------------------------------------------------------
   IMPORTS — classes prontas que o Java/Spring nos empresta.
   - JdbcTemplate : "mãozinha" que executa SQL sem código manual.
   - GetMapping   : rótulo que liga um endereço a um método (GET).
   - RestController: diz que a classe devolve JSON, não página.
   - Map          : estrutura chave -> valor, igual objeto {} do JS.
---------------------------------------------------------------- */
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/* ------------------------------------------------------------------
   CLASSE
   @RestController = "esta classe é um controller de JSON".
   O Spring a enxerga sozinho e cuida de criar tudo que ela precisar.
------------------------------------------------------------------ */
@RestController
public class HealthController {

    /* ATRIBUTO — a "mãozinha" que executa SQL.
       * private : só esta classe pode mexer nele.
       * final   : depois de criado, nunca mais é trocado.
       Ele não é criado com "new" de propósito: o construtor o recebe
       pronto, vindo do application.properties. */
    private final JdbcTemplate jdbc;

    /* CONSTRUTOR — método com o mesmo nome da classe, roda UMA vez,
       na hora em que o Spring "acorda" o app.
       O parâmetro JdbcTemplate chega PRONTO, criado pelo Spring.
       Isso é a INJEÇÃO DE DEPENDÊNCIA: você não faz "new", pede e recebe. */
    public HealthController(JdbcTemplate jdbc) {
        /* "este atributo jdbc da classe recebe o jdbc que me entregaram".
           O this resolve o empate entre os dois nomes iguais. */
        this.jdbc = jdbc;
    }

    /* MÉTODO QUE ATENDE O PEDIDO
       @GetMapping("/api/health") liga este método ao endereço /api/health.
       public              : qualquer um pode chamar.
       Map<String, String> : devolve um dicionário de texto, virado JSON.
       health()            : não recebe nenhum dado (parênteses vazios). */
    @GetMapping("/api/health")
    public Map<String, String> health() {

        /* A PROVA: SQL especial do SQL Server que devolve 1 linha de texto
           com a versão do banco. queryForObject executa e já converte
           o resultado em texto (String.class), guardando em "versao". */
        String versao = jdbc.queryForObject("SELECT @@VERSION", String.class);

        /* MONTANDO A RESPOSTA: um dicionário de 2 pares chave -> valor:
           "status" -> "ok" e "banco" -> a versão sem espaços extras
           (o .trim() corta os vazios do começo e do fim do texto).
           O Spring transforma isso no JSON que vai ao navegador. */
        return Map.of(
                "status", "ok",
                "banco", versao.trim()
        );
    }
}