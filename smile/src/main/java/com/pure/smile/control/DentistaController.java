package com.pure.smile.control;

import com.pure.smile.dto.request.PacienteRequest;
import com.pure.smile.dto.response.DentistaResponse;
import com.pure.smile.dto.response.PacienteResponse;
import com.pure.smile.model.DentistaModel;
import com.pure.smile.model.PacienteModel;
import com.pure.smile.service.DentistaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/dentistas")
public class DentistaController {
    private DentistaService service;

    @PostMapping
    public ResponseEntity<Void> createDentista(@Valid @RequestBody PacienteRequest request) {
        service.criar(modelo(request));
        return ResponseEntity.status(201).build();
    }
        public List<DentistaResponse> readAll(){
            return service.listarTodos().stream().map(this::resposta).toList();
        }
        @GetMapping("/{id}")
        public DentistaResponse read(@PathVariable Long id){
        return service.buscarPorId(id);
    }
    @PutMapping("/{id}")
    public DentistaResponse update(@PathVariable Long id, @Valid @RequestBody PacienteRequest request) {
        PacienteModel model = new PacienteModel();

        model.setIdPaciente(id);

        service.buscarPorId(id);
        service.atualizar(id, model);

        return resposta(service.buscarPorId(id));
    }
    @DeleteMapping ("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id){
        service.desativar(id);
        return  ResponseEntity.noContent().build();
    }
    private DentistaResponse resposta(DentistaModel model){
        DentistaResponse response = new DentistaResponse();
         response.setIdUsuario(model.getIdUser());
         response.setIdDentista(model.getIdDentista());
         response.setNomeCompleto(model.getNome());
         response.setEmail(model.getEmail());
         response.setAtivo(model.isAtivo());
         response.setCro(model.getCro());
         response.setRole(model.getRole());
         response.setDataNascimento(model.getDataNasc());

         return response;
    }
    private PacienteModel mmodelo (PacienteRequest request){
        PacienteModel pacienteModel = new PacienteModel();

        pacienteModel.setNome(request.getNomeCompleto());
        pacienteModel.setEmail(request.getEmail());
        pacienteModel.setSenha(request.getSenha());
        pacienteModel.setCro(request.getCro());
        pacienteModel.setDataNasc(request.getDataNascimento());
        pacienteModel.setTelefone(request.getTelefone());

        return pacienteModel;
    }
}
