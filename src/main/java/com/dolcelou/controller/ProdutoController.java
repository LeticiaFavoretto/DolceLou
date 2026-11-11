package com.dolcelou.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dolcelou.model.ProdutoEntity;
import com.dolcelou.service.ProdutoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("v1/produto")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService service;

    @GetMapping("/find/{id}")
    public ResponseEntity<ProdutoEntity> findProductByID(@PathVariable String id) {
        return ResponseEntity.ok(service.findProductById(id));
    }
    
    @PostMapping("/create")
    public ResponseEntity<ProdutoEntity> createProduct(@RequestBody ProdutoEntity entity) {
        return ResponseEntity.ok(service.saveProduct(entity));
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<ProdutoEntity> updateProduct(@PathVariable String id, @RequestBody ProdutoEntity entity) {
        return ResponseEntity.ok(service.updateProduct(id, entity));
    }

    @GetMapping("/findAll")
    public ResponseEntity<List<ProdutoEntity>> findAll() {
        return ResponseEntity.ok(service.findAllProducts());
    }
    
    @DeleteMapping("/delete/{id}")
    public void deleteProduct(@PathVariable String id) {
        service.deleteProductById(id);
    }
}