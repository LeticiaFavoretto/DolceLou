package com.dolcelou.controller;

import com.dolcelou.model.AcessoEntity;
import com.dolcelou.service.AcessoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;
import com.dolcelou.config.TokenService;


@RestController
@RequestMapping("v1/acesso")
@RequiredArgsConstructor
public class AcessoController {
    
    private final AcessoService service;
    private final TokenService tokenService;

    @GetMapping("/findAll")
    public ResponseEntity<List<AcessoEntity>> findAll() {
        return ResponseEntity.ok((service.findAll()));
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<AcessoEntity> getAcessById(@PathVariable String id) {
        return ResponseEntity.ok(service.getAcessById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<AcessoEntity> createAcess(@RequestBody AcessoEntity entity, Authentication authentication) {
        if (entity.getAcesso() == AcessoEntity.Acesso.FUNCIONARIO &&
                (authentication == null || !authentication.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_FUNCIONARIO")))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(service.saveAcess(entity));
    }
    
    @GetMapping("/delete/{id}")
    public void deleteAcessById(@PathVariable String id) {
        service.deleteAcessById(id);
    }

    @GetMapping("/login")
    public Map<String, Object> login(@RequestHeader String email, @RequestHeader String senha) {
        AcessoEntity usuario = service.login(email, senha);
        String token = tokenService.create(usuario.getId(), usuario.getEmail(), usuario.getAcesso().name());
        return Map.of("token", token, "id", usuario.getId(), "email", usuario.getEmail(), "acesso", usuario.getAcesso());
    }
}
