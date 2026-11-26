package com.pure.smile.control;

import com.pure.smile.dto.request.ConvenioRequest;
import com.pure.smile.dto.response.ConvenioResponse;
import com.pure.smile.model.ConvenioModel;
import com.pure.smile.service.ConvenioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/convenios")
public class ConvenioController {
    private final ConvenioService service;

    public ConvenioController(ConvenioService service) {
        this.service = service;
    }

    @GetMapping
    public List<ConvenioResponse> listar() {
        return service.listarTodos()
                .stream()
                .map(this::resposta)
                .toList();
    }

    @GetMapping("/{id}")
    public ConvenioResponse buscar(@PathVariable Long id) {
        return resposta(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Void> criar(
            @Valid @RequestBody ConvenioRequest request) {

        service.criar(modelo(request));
        return ResponseEntity.status(201).build();
    }

    @PutMapping("/{id}")
    public ConvenioResponse atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ConvenioRequest request) {

        ConvenioModel model = modelo(request);
        model.setIdConvenio(id);

        service.buscarPorId(id);
        service.atualizar(model);

        return resposta(service.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        service.desativar(id);
        return ResponseEntity.noContent().build();
    }

    private ConvenioResponse resposta(ConvenioModel model) {
        ConvenioResponse response = new ConvenioResponse();

        response.setIdConvenio(model.getIdConvenio());
        response.setNome(model.getNome());
        response.setCnpj(model.getCnpj());
        response.setEmail(model.getEmail());
        response.setTelefone(model.getTelefone());
        response.setAtivo(model.isAtivo());
        response.setCoberturaDescricao(model.getCoberturaDescricao());

        return response;
    }

    private ConvenioModel modelo(ConvenioRequest request) {
        ConvenioModel model = new ConvenioModel();

        model.setNome(request.getNome());
        model.setCnpj(request.getCnpj());
        model.setEmail(request.getEmail());
        model.setTelefone(request.getTelefone());
        model.setCoberturaDescricao(request.getCoberturaDescricao());

        return model;
    }
}
