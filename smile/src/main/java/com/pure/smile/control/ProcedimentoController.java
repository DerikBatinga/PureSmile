package com.pure.smile.control;

import com.pure.smile.dto.request.ProcedimentoRequest;
import com.pure.smile.dto.response.ProcedimentoResponse;
import com.pure.smile.model.ProcedimentoModel;
import com.pure.smile.service.ProcedimentoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

// Recebe requisições HTTP e devolve JSON. As regras ficam no service, não aqui.
@RestController
@RequestMapping("/api/procedimentos") // Prefixo comum a todas as rotas abaixo.
public class ProcedimentoController {
    private final ProcedimentoService service;

    // O Spring entrega o service pelo construtor (injeção de dependência).
    public ProcedimentoController(ProcedimentoService service) {
        this.service = service;
    }

    // GET /api/procedimentos: busca todos e converte cada model em resposta da API.
    @GetMapping
    public List<ProcedimentoResponse> listar() {
        return service.listarTodos().stream().map(this::resposta).toList();
    }

    // GET /api/procedimentos/12: @PathVariable lê o 12 da URL como Long.
    @GetMapping("/{id}")
    public ProcedimentoResponse buscar(@PathVariable Long id) {
        return resposta(service.buscarPorId(id));
    }

    // POST /api/procedimentos: @RequestBody lê o JSON; @Valid aplica as regras do DTO.
    @PostMapping
    public ResponseEntity<ProcedimentoResponse> criar(@Valid @RequestBody ProcedimentoRequest request) {
        ProcedimentoModel criado = service.criar(modelo(request));
        // 201 Created, com a URL do novo recurso no cabeçalho Location.
        return ResponseEntity.created(URI.create("/api/procedimentos/" + criado.getIdProcedimento()))
                .body(resposta(criado));
    }

    // PUT /api/procedimentos/12: substitui os dados editáveis do registro 12.
    @PutMapping("/{id}")
    public ProcedimentoResponse atualizar(@PathVariable Long id, @Valid @RequestBody ProcedimentoRequest request) {
        return resposta(service.atualizar(id, modelo(request)));
    }

    // DELETE /api/procedimentos/12: 204 indica sucesso sem corpo de resposta.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    // O DTO de entrada usa "preco"; o model interno chama esse campo de "valor".
    private ProcedimentoModel modelo(ProcedimentoRequest request) {
        ProcedimentoModel model = new ProcedimentoModel();
        model.setNome(request.getNome());
        model.setDescricao(request.getDescricao());
        model.setValor(request.getPreco());
        return model;
    }

    // Expõe ao cliente apenas os campos definidos para a resposta da API.
    private ProcedimentoResponse resposta(ProcedimentoModel model) {
        ProcedimentoResponse response = new ProcedimentoResponse();
        response.setIdProcedimento(model.getIdProcedimento());
        response.setNome(model.getNome());
        response.setDescricao(model.getDescricao());
        response.setPreco(model.getValor());
        return response;
    }
}
