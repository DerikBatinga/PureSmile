package com.pure.smile.control;

import com.pure.smile.dto.request.ConvenioRequest;
import com.pure.smile.dto.request.PacienteRequest;
import com.pure.smile.dto.response.ConvenioResponse;
import com.pure.smile.dto.response.PacienteResponse;
import com.pure.smile.model.PacienteModel;
import com.pure.smile.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {
    private PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    @PostMapping
    public ResponseEntity<Void> createPaciente(@Valid @RequestBody PacienteRequest request) {
        pacienteService.createPaciente(modelo(request));
        return ResponseEntity.status(201).build();
    }
    public List<PacienteResponse> readAll(){
        return pacienteService.listarTodos().stream().map(this::resposta).toList();
    }
    @GetMapping("/{id}")
    public PacienteResponse readPaciente(@PathVariable Long id) {
        return resposta(pacienteService.buscarPorId(id));
    }
    @PutMapping("/{id}")
    public PacienteResponse updatePaciente(@PathVariable Long id, @Valid @RequestBody PacienteRequest request){
        PacienteModel model = modelo(request);

        model.setIdPaciente(id);
        pacienteService.buscarPorId(id);
        pacienteService.updatePaciente(id,model);

        return resposta(pacienteService.buscarPorId(id));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaciente(@PathVariable Long id){
        pacienteService.desativar(id);
        return ResponseEntity.noContent().build();
    }
    private PacienteResponse resposta(PacienteModel model){
        PacienteResponse response = new PacienteResponse();
        response.setIdUsuario(model.getIdUser());
        response.setIdPaciente(model.getIdPaciente());
        response.setNomeCompleto(model.getNome());
        response.setEmail(model.getEmail());
        response.setAtivo(model.isAtivo());
        response.setCpf(model.getCpf());
        response.setSexo(model.getSexo());
        response.setTelefone(model.getTelefone());
        response.setDataNascimento(model.getDataNasc());
        response.setIdConvenio(model.getIdConvenio());

        return response;
    }

    private PacienteModel modelo (PacienteRequest request){
        PacienteModel pacienteModel = new PacienteModel();

        pacienteModel.setNome(request.getNomeCompleto());
        pacienteModel.setCpf(request.getCpf());
        pacienteModel.setEmail(request.getEmail());
        pacienteModel.setSenha(request.getSenha());
        pacienteModel.setTelefone(request.getTelefone());
        pacienteModel.setDataNasc(request.getDataNascimento());
        pacienteModel.setIdConvenio(request.getIdConvenio());
        return pacienteModel;
    }
}