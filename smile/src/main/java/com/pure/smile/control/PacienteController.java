package com.pure.smile.control;

import com.pure.smile.model.PacienteModel;
import com.pure.smile.service.PacienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pacientes")
public class PacienteControl {
    private PacienteService pacienteService;

    @PostMapping
    public ResponseEntity<Void> createPaciente(@RequestBody PacienteModel p) {
        pacienteService.createPaciente(p);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @GetMapping("/{id}")
    public PacienteModel readPaciente(@PathVariable Long id) {
        return pacienteService.buscarPorId(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Void> updatePaciente(@PathVariable Long id, @RequestBody PacienteModel p){
        pacienteService.updatePaciente(id, p);
        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaciente(@PathVariable Long id){
        pacienteService.desativar(id);
        return ResponseEntity.noContent().build();
    }
}