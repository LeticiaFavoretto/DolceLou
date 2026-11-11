package com.dolcelou.service;

import com.dolcelou.model.CarrinhoEntity;
import com.dolcelou.model.CarrinhoItemEntity;
import com.dolcelou.model.ProdutoEntity;
import com.dolcelou.repository.AcessoRepository;
import com.dolcelou.repository.CarrinhoItemRepository;
import com.dolcelou.repository.CarrinhoRepository;
import com.dolcelou.repository.ProdutoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarrinhoServiceTest {

    @Mock CarrinhoRepository carrinhoRepository;
    @Mock CarrinhoItemRepository carrinhoItemRepository;
    @Mock ProdutoRepository produtoRepository;
    @Mock AcessoRepository acessoRepository;
    @InjectMocks CarrinhoService service;

    private ProdutoEntity produto(double estoque) {
        return ProdutoEntity.builder()
                .nome("Bolo de chocolate")
                .preco(new BigDecimal("25.00"))
                .quantidade(estoque)
                .build();
    }

    @Test
    void injetaRepositoriesPeloConstrutor() {
        assertDoesNotThrow(() -> CarrinhoService.class.getDeclaredConstructor(
                CarrinhoRepository.class, CarrinhoItemRepository.class,
                ProdutoRepository.class, AcessoRepository.class));
    }

    @Test
    void rejeitaQuantidadeZeroAntesDeAcessarBanco() {
        var exception = assertThrows(IllegalArgumentException.class,
                () -> service.adicionarAoCarrinho("usuario-1", "produto-1", 0));

        assertEquals("Quantidade deve ser maior que zero", exception.getMessage());
        verifyNoInteractions(carrinhoRepository, carrinhoItemRepository, produtoRepository, acessoRepository);
    }

    @Test
    void rejeitaQuantidadeNulaAntesDeAcessarBanco() {
        var exception = assertThrows(IllegalArgumentException.class,
                () -> service.adicionarAoCarrinho("usuario-1", "produto-1", null));

        assertEquals("Quantidade deve ser maior que zero", exception.getMessage());
        verifyNoInteractions(carrinhoRepository, carrinhoItemRepository, produtoRepository, acessoRepository);
    }

    @Test
    void adicionaItemAoCarrinhoExistente() {
        var produto = produto(8);
        var carrinho = new CarrinhoEntity();
        carrinho.setId("carrinho-1");

        when(produtoRepository.findById("produto-1")).thenReturn(Optional.of(produto));
        when(carrinhoRepository.findByAcesso_Id("usuario-1")).thenReturn(Optional.of(carrinho));
        when(carrinhoItemRepository.findByCarrinhoIdAndProdutoId("carrinho-1", "produto-1"))
                .thenReturn(Optional.empty());

        service.adicionarAoCarrinho("usuario-1", "produto-1", 2);

        var itemCaptor = ArgumentCaptor.forClass(CarrinhoItemEntity.class);
        verify(carrinhoItemRepository).save(itemCaptor.capture());
        var item = itemCaptor.getValue();
        assertEquals(2, item.getQuantidade());
        assertSame(produto, item.getProduto());
        assertSame(carrinho, item.getCarrinho());
        assertEquals(new BigDecimal("25.00"), item.getPrecoUnitario());
        verify(carrinhoRepository).save(carrinho);
    }

    @Test
    void rejeitaAdicionarAcimaDoEstoqueSomandoItemExistente() {
        var carrinho = new CarrinhoEntity();
        carrinho.setId("carrinho-1");
        var item = new CarrinhoItemEntity();
        item.setQuantidade(4);

        when(produtoRepository.findById("produto-1")).thenReturn(Optional.of(produto(5)));
        when(carrinhoRepository.findByAcesso_Id("usuario-1")).thenReturn(Optional.of(carrinho));
        when(carrinhoItemRepository.findByCarrinhoIdAndProdutoId("carrinho-1", "produto-1"))
                .thenReturn(Optional.of(item));

        var exception = assertThrows(IllegalArgumentException.class,
                () -> service.adicionarAoCarrinho("usuario-1", "produto-1", 2));

        assertEquals("Quantidade insuficiente em estoque", exception.getMessage());
        assertEquals(4, item.getQuantidade());
        verify(carrinhoItemRepository, never()).save(any());
        verify(carrinhoRepository, never()).save(any());
    }

    @Test
    void rejeitaAtualizarQuantidadeNulaAntesDeAcessarBanco() {
        var exception = assertThrows(IllegalArgumentException.class,
                () -> service.atualizarQuantidade("usuario-1", "produto-1", null));

        assertEquals("Quantidade deve ser maior que zero", exception.getMessage());
        verifyNoInteractions(carrinhoRepository, carrinhoItemRepository, produtoRepository, acessoRepository);
    }
}
