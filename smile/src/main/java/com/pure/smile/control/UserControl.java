package com.pure.smile.control;

import com.pure.smile.model.UserModel;
import com.pure.smile.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UserControl {
    private final UserService userService;
    public UserControl(UserService userService) {
    this.userService = userService;
    }
     @PostMapping
    public ResponseEntity<Void> criar (@RequestBody UserModel user){
        userService.criar(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
     }
     @GetMapping
      public ResponseEntity<List<UserModel>> listarTodos(){
        return ResponseEntity.ok((userService.listarTodos()));
     }
     @GetMapping("/{id}")
     public ResponseEntity<UserModel> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(userService.buscarPorId(id));
     }

    @PutMapping("/{id}")
    public ResponseEntity<Void> atualizar(@PathVariable Long id, @RequestBody UserModel user){
        user.setIdUser(id);
        userService.atualizar(user);
        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> Deletar (@PathVariable Long id){
        userService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}