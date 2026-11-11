package com.dolcelou.service;


import com.dolcelou.model.ProdutoEntity;
import com.dolcelou.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoEntity saveProduct(ProdutoEntity produto) {
        if (!(existsProductByName(produto)) && validateProduct(produto)) {
            return produtoRepository.save(produto);
        }
        throw new RuntimeException("Produto não válido ou já cadastrado na base");
    }

    public ProdutoEntity updateProduct(String id, ProdutoEntity produto) {
        if (existProductById(id) && validateProduct(produto)) {
            return produtoRepository.save(produto);
        }
        throw new RuntimeException("Produto não válido ou não cadastrado na base");
    }
    
    public List<ProdutoEntity> findAllProducts() {
        return produtoRepository.findAll();
    }

    public ProdutoEntity findProductById(String id) {
        return produtoRepository.findById(id).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    public void deleteProductById(String id) {
        produtoRepository.deleteById(id);
    }

    private boolean existProductById(String id) {
        return produtoRepository.existsById(id);
    }
    
    private boolean validateProduct(ProdutoEntity produtoEntity) {
        return  produtoEntity.getPreco().compareTo(BigDecimal.ZERO) > 0
        && produtoEntity.getQuantidade() > 0;
    }
    
    private boolean existsProductByName(ProdutoEntity produtoEntity) {
        var products = produtoRepository.findAll();
        var count = products.stream()
            .filter(p -> p.getNome().equals(produtoEntity.getNome())).count();
        return count > 0;
    }
    
}