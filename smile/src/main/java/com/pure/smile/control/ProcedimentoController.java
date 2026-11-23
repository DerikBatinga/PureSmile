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

@RestController
@RequestMapping("/api/procedimentos")
public class ProcedimentoController {
    private final ProcedimentoService service;

    public ProcedimentoController(ProcedimentoService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProcedimentoResponse> listar() {
        return service.listarTodos().stream().map(this::resposta).toList();
    }

    @GetMapping("/{id}")
    public ProcedimentoResponse buscar(@PathVariable Long id) {
        return resposta(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProcedimentoResponse> criar(@Valid @RequestBody ProcedimentoRequest request) {
        ProcedimentoModel criado = service.criar(modelo(request));
        return ResponseEntity.created(URI.create("/api/procedimentos/" + criado.getIdProcedimento()))
                .body(resposta(criado));
    }

    @PutMapping("/{id}")
    public ProcedimentoResponse atualizar(@PathVariable Long id, @Valid @RequestBody ProcedimentoRequest request) {
        return resposta(service.atualizar(id, modelo(request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    private ProcedimentoModel modelo(ProcedimentoRequest request) {
        ProcedimentoModel model = new ProcedimentoModel();
        model.setNome(request.getNome());
        model.setDescricao(request.getDescricao());
        model.setValor(request.getPreco());
        return model;
    }

    private ProcedimentoResponse resposta(ProcedimentoModel model) {
        ProcedimentoResponse response = new ProcedimentoResponse();
        response.setIdProcedimento(model.getIdProcedimento());
        response.setNome(model.getNome());
        response.setDescricao(model.getDescricao());
        response.setPreco(model.getValor());
        return response;
    }
}
