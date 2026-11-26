package com.pure.smile.control;

import com.pure.smile.dto.request.ConsultaRequest;
import com.pure.smile.dto.response.ConsultaResponse;
import com.pure.smile.model.ConsultaModel;
import com.pure.smile.service.ConsultaService;
import com.pure.smile.enums.ConsultaStatus;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultas")
public class ConsultaController {
    private final ConsultaService service;

    public ConsultaController(ConsultaService service) {
        this.service = service;
    }

    @GetMapping
    public List<ConsultaResponse> listar(){
        return service.listarTodos().stream().map(this::resposta).toList();
    }

    @GetMapping("/{id}")
    public ConsultaResponse buscar(@PathVariable Long id){
        return resposta(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Void> agendar(
            @Valid @RequestBody ConsultaRequest request) {

        service.agendar(modelo(request));
        return ResponseEntity.status(201).build();
    }

    @PutMapping("/{id}")
    public ConsultaResponse atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ConsultaRequest request) {

        service.atualizar(id, modelo(request));
        return resposta(service.buscarPorId(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> alterarStatus(
            @PathVariable Long id,
            @RequestParam ConsultaStatus status) {

        service.alterarStatus(id, status);
        return ResponseEntity.noContent().build();
    }

    private ConsultaModel modelo(ConsultaRequest request){
        ConsultaModel model = new ConsultaModel();
        model.setDataConsulta(request.getDataConsulta());
        model.setObservacoes(request.getObservacao());
        model.setIdDentista(request.getIdDentista());
        model.setIdPaciente(request.getIdPaciente());
        return model;
    }

    private ConsultaResponse resposta(ConsultaModel model) {
        ConsultaResponse response = new ConsultaResponse();
        response.setIdConsulta(model.getIdConsulta());
        response.setIdPaciente(model.getIdPaciente());
        response.setIdDentista(model.getIdDentista());
        response.setDataConsulta(model.getDataConsulta());
        response.setStatus(model.getStatus());
        response.setObservacao(model.getObservacoes());
        return response;
    }
}
