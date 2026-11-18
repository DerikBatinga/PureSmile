package com.pure.smile;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Files;
import java.nio.file.Path;

/* =====================================================================
   WEBCONFIG — ENTREGA AS TELAS (HTML, CSS, JS, IMAGENS) PELO SPRING BOOT
   ---------------------------------------------------------------------
   PROBLEMA QUE ESTA CLASSE RESOLVE:
   Se voce abre as telas direto pelo arquivo (duplo clique no HTML),
   o navegador nao enxerga o backend. Esta classe faz com que o proprio
   servidor Java entregue as telas, tudo junto em http://localhost:8080.

   COMO FUNCIONA:
   addResourceHandlers -> "apelida" cada pasta de arquivos com um endereco.
                          Exemplo: http://localhost:8080/JS/layout.js
                          vira um arquivo real dentro da pasta view/JS/.
   addViewControllers  -> deixa um atalho: abrir "/" cai no login.html.

   O MOTIVO DESTA NOVA VERSAO (a primeira quebrou em 2 lugares):
   1) A primeira versao achava a pasta de telas com a formula
      System.getProperty("user.dir") + "/src/main/java/...".
      Mas o log mostrou que o programa rodava na pasta PureSmile/
      (e nao em PureSmile/smile/). O caminho ficou apontando para uma
      pasta que nao existia -> erro "No static resource login.html".
   2) Esta versao TESTA os dois caminhos possiveis e usa o que existe.
   ===================================================================== */

@Configuration                                               // avisa o Spring: "esta classe tem ajustes de configuracao"
public class WebConfig implements WebMvcConfigurer {         // WebMvcConfigurer = "molde" padrao para ajustar o Spring MVC

    /* Pasta onde moram as telas. E um caminho fisico do computador,
       ex: "file:/home/guilherme/Documents/GitHub/PureSmile/smile/...".
       O valor e preenchido no CONSTRUTOR, la embaixo. */
    private final String VIEW;

    /* CONSTRUTOR - roda UMA unica vez, quando o programa sobe.
       E aqui que descobrimos ONDE a pasta view realmente esta. */
    public WebConfig() {

        /* user.dir = a pasta onde o programa foi INICIADO.
           No seu IntelliJ ele apontava para a raiz "PureSmile/". */
        String dir = System.getProperty("user.dir");

        /* Caso 1: a pasta view dentro da raiz (jeito normal do modulo). */
        String caminhoSemSmile = dir + "/src/main/java/com/pure/smile/view/";

        /* Caso 2: a pasta view dentro de "PureSmile/smile/...".
           Precisamos dela porque o seu IntelliJ iniciou o programa
           a partir da raiz do repositorio. */
        String caminhoComSmile = dir + "/smile/src/main/java/com/pure/smile/view/";

        /* Files.exists(Path.of(x)) responde: "essa pasta existe?" (sim ou nao).
           Se o caminho 1 existir, usa ele; senao, usa o caminho 2.
           O prefixo "file:" avisa o Spring que e um endereco de computador.
           O sinal de pergunta ( ? ) e o "se... senao..." em uma linha so:
             condicao ? valorSeVerdadeiro : valorSeFalso                       */
        this.VIEW = "file:" + (Files.exists(Path.of(caminhoSemSmile)) ? caminhoSemSmile : caminhoComSmile);

        /* Mostra no CONSOLE qual caminho foi escolhido. Se o site nao abrir,
           e aqui que voce olha primeiro. */
        System.out.println("[WebConfig] Servindo as telas de: " + VIEW);
    }

    /* Metodo do Spring chamado na hora de "ligar" o sistema de arquivos.
       Aqui registramos um APELIDO de URL para cada pasta de telas. */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        /*   PEDIDO NA URL:    ARQUIVO REAL SERVIDO:    */
        /*   /HTML/...  ->  view/HTML/...   (as paginas .html)    */
        /*   /css/...   ->  view/css/...    (folhas de estilo)    */
        /*   /JS/...    ->  view/JS/...     (JavaScript)          */
        /*   /IMG/...   ->  view/IMG/...    (imagens)             */

        /* Por que os apelidos tem que ser exatamente esses?
           Porque as telas usam caminhos RELATIVOS, por exemplo:
           <link href="../css/global.css"> dentro de /HTML/login.html,
           o navegador resolve ".." subindo da pasta HTML para a raiz,
           e pede /css/global.css. Sem o apelido, seria erro 404. */
        registry.addResourceHandler("/HTML/**").addResourceLocations(VIEW + "HTML/");
        registry.addResourceHandler("/css/**").addResourceLocations(VIEW + "css/");
        registry.addResourceHandler("/JS/**").addResourceLocations(VIEW + "JS/");
        registry.addResourceHandler("/IMG/**").addResourceLocations(VIEW + "IMG/");
    }

    /* Metodo do Spring para criar ATALHOS de pagina (view controllers).
       Aqui: abrir http://localhost:8080 (so a barrinha "/") leva ao login,
       em vez de cair numa pagina de erro 404. */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {

        /* "forward:" reenvia o pedido "/" para "/HTML/login.html".
           Quem atende o login e o apelido /HTML/ criado la em cima.
           Resultado: navegador -> localhost:8080 -> tela de login. */
        registry.addViewController("/").setViewName("forward:/HTML/login.html");
    }
}