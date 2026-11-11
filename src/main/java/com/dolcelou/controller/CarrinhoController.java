package com.dolcelou.controller;

import com.dolcelou.dto.AtualizarItemDto;
import com.dolcelou.dto.CarrinhoDto;
import com.dolcelou.service.CarrinhoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/carrinho")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CarrinhoController {

    @Autowired
    private CarrinhoService carrinhoService;

    @PostMapping("/create")
    public ResponseEntity<?> adicionarAoCarrinho(
            @RequestHeader("idUsuario") String idUsuario,
            @RequestBody AtualizarItemDto request) {
        System.out.println(">>> CHEGOU NO CONTROLLER! idUsuario: " + idUsuario);
        try {
            carrinhoService.adicionarAoCarrinho(
                    idUsuario,
                    request.getIdProduto(),
                    request.getQuantidade()
            );
            return ResponseEntity.ok().build(); // ou ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping
    public ResponseEntity<?> obterCarrinho(
            @RequestHeader("idUsuario") String idUsuario) {
        try {
            CarrinhoDto carrinho = carrinhoService.obterCarrinho(idUsuario);
            return ResponseEntity.ok(carrinho);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PatchMapping("/update/{idProduto}")
    public ResponseEntity<?> atualizarQuantidade(
            @RequestHeader("idUsuario") String idUsuario,
            @PathVariable String idProduto,
            @RequestBody AtualizarItemDto request) {

        try {
            carrinhoService.atualizarQuantidade(
                    idUsuario,
                    idProduto,
                    request.getQuantidade()
            );

            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/delete/{idProduto}")
    public ResponseEntity<?> removerDoCarrinho(
            @RequestHeader("idUsuario") String idUsuario,
            @PathVariable String idProduto) {

        try {
            carrinhoService.removerDoCarrinho(idUsuario, idProduto);

            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping
    public ResponseEntity<?> limparCarrinho(
            @RequestHeader("idUsuario") String idUsuario) {

        try {
            carrinhoService.limparCarrinho(idUsuario);

            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

}