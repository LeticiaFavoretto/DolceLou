package com.dolcelou.service;

import com.dolcelou.model.ProdutoEntity;
import com.dolcelou.repository.ProdutoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {
    @Mock ProdutoRepository repository;
    @InjectMocks ProdutoService service;

    private ProdutoEntity produto(String nome, BigDecimal preco, double quantidade) {
        return ProdutoEntity.builder().nome(nome).preco(preco).quantidade(quantidade)
                .medida("unidade").descricao("Produto artesanal")
                .categoria(ProdutoEntity.Categoria.bolo).build();
    }

    @Test
    void savesValidNonDuplicateProduct() {
        ProdutoEntity produto = produto("Bolo", new BigDecimal("25.00"), 3);
        when(repository.findAll()).thenReturn(List.of());
        when(repository.save(produto)).thenReturn(produto);
        assertSame(produto, service.saveProduct(produto));
        verify(repository).save(produto);
    }

    @Test
    void rejectsDuplicateProductName() {
        ProdutoEntity existing = produto("Bolo", new BigDecimal("25.00"), 3);
        when(repository.findAll()).thenReturn(List.of(existing));
        assertThrows(RuntimeException.class, () -> service.saveProduct(existing));
        verify(repository, never()).save(any());
    }

    @Test
    void rejectsZeroPrice() {
        ProdutoEntity produto = produto("Bolo", BigDecimal.ZERO, 3);
        when(repository.findAll()).thenReturn(List.of());
        assertThrows(RuntimeException.class, () -> service.saveProduct(produto));
        verify(repository, never()).save(any());
    }

    @Test
    void rejectsZeroStock() {
        ProdutoEntity produto = produto("Bolo", new BigDecimal("20.00"), 0);
        when(repository.findAll()).thenReturn(List.of());
        assertThrows(RuntimeException.class, () -> service.saveProduct(produto));
        verify(repository, never()).save(any());
    }

    @Test
    void retrievesProductById() {
        ProdutoEntity produto = produto("Bolo", new BigDecimal("25.00"), 3);
        when(repository.findById("abc")).thenReturn(Optional.of(produto));
        assertSame(produto, service.findProductById("abc"));
    }

    @Test
    void throwsForUnknownId() {
        when(repository.findById("inexistente")).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.findProductById("inexistente"));
    }
}
