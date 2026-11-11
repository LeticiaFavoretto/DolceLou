package com.dolcelou.service;

import com.dolcelou.dto.CarrinhoDto;
import com.dolcelou.dto.CarrinhoItemDto;
import com.dolcelou.dto.CarrinhoResumoDto;
import com.dolcelou.model.AcessoEntity;
import com.dolcelou.model.CarrinhoEntity;
import com.dolcelou.model.CarrinhoItemEntity;
import com.dolcelou.model.ProdutoEntity;
import com.dolcelou.repository.AcessoRepository;
import com.dolcelou.repository.CarrinhoItemRepository;
import com.dolcelou.repository.CarrinhoRepository;
import com.dolcelou.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CarrinhoService {

    private CarrinhoRepository carrinhoRepository;
    private CarrinhoItemRepository carrinhoItemRepository;
    private ProdutoRepository produtoRepository;
    private AcessoRepository acessoRepository;

    @Transactional
    public void adicionarAoCarrinho(String idUsuario, String idProduto, Integer quantidade) {

        ProdutoEntity produto = produtoRepository.findById(idProduto)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));

        if (produto.getQuantidade() < quantidade) {
            throw new IllegalArgumentException("Quantidade insuficiente em estoque");
        }

        // 2. Obter ou criar carrinho
        CarrinhoEntity carrinho = carrinhoRepository.findByAcesso_Id(idUsuario)
                .orElseGet(() -> criarCarrinhoParaUsuario(idUsuario));

        var itemExistente = carrinhoItemRepository
                .findByCarrinhoIdAndProdutoId(carrinho.getId(), idProduto);

        if (itemExistente.isPresent()) {
            CarrinhoItemEntity item = itemExistente.get();
            item.setQuantidade(item.getQuantidade() + quantidade);
            carrinhoItemRepository.save(item);
        } else {
            CarrinhoItemEntity novoItem = new CarrinhoItemEntity();
            novoItem.setCarrinho(carrinho);
            novoItem.setProduto(produto);
            novoItem.setQuantidade(quantidade);
            novoItem.setPrecoUnitario(produto.getPreco());
            carrinhoItemRepository.save(novoItem);
        }

        carrinho.setDataAtualizacao(LocalDateTime.now());
        carrinhoRepository.save(carrinho);
    }

    @Transactional
    public void atualizarQuantidade(String idUsuario, String idProduto, Integer novaQuantidade) {

        if (novaQuantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero");
        }

        ProdutoEntity produto = produtoRepository.findById(idProduto)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));

        if (produto.getQuantidade() < novaQuantidade) {
            throw new IllegalArgumentException("Quantidade insuficiente em estoque");
        }

        CarrinhoEntity carrinho = carrinhoRepository.findByAcesso_Id(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Carrinho não encontrado"));

        CarrinhoItemEntity item = carrinhoItemRepository
                .findByCarrinhoIdAndProdutoId(carrinho.getId(), idProduto)
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado no carrinho"));

        item.setQuantidade(novaQuantidade);
        carrinhoItemRepository.save(item);

        carrinho.setDataAtualizacao(LocalDateTime.now());
        carrinhoRepository.save(carrinho);
    }

    // ============ REMOVER DO CARRINHO ============
    @Transactional
    public void removerDoCarrinho(String idUsuario, String idProduto) {

        var carrinho = carrinhoRepository.findByAcesso_Id(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Carrinho não encontrado"));

        var item = carrinhoItemRepository
                .findByCarrinhoIdAndProdutoId(carrinho.getId(), idProduto)
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado no carrinho"));

        carrinhoItemRepository.delete(item);

        carrinho.setDataAtualizacao(LocalDateTime.now());
        carrinhoRepository.save(carrinho);
    }

    @Transactional(readOnly = true)
    public CarrinhoDto obterCarrinho(String idUsuario) {

        CarrinhoEntity carrinho = carrinhoRepository.findByAcesso_Id(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Carrinho não encontrado"));

        var itens = carrinho.getItens().stream()
                .map(item -> new CarrinhoItemDto(
                        item.getId(),
                        item.getProduto().getId(),
                        item.getProduto().getNome(),
                        item.getProduto().getCategoria(),
                        item.getQuantidade(),
                        item.getPrecoUnitario(),
                        item.getSubtotal()
                ))
                .collect(Collectors.toList());

        Optional<BigDecimal> total = itens.stream()
                .map(CarrinhoItemDto::getSubtotal)
                .reduce(BigDecimal::add);

        Integer quantidadeItens = itens.stream()
                .mapToInt(CarrinhoItemDto::getQuantidade)
                .sum();

        CarrinhoResumoDto resumo = new CarrinhoResumoDto(
                quantidadeItens,
                itens.size(),
                total.orElse(BigDecimal.ZERO)
        );

        return new CarrinhoDto(itens, resumo);
    }

    @Transactional
    public void limparCarrinho(String idUsuario) {

        CarrinhoEntity carrinho = carrinhoRepository.findByAcesso_Id(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Carrinho não encontrado"));

        carrinho.getItens().clear();
        carrinho.setDataAtualizacao(LocalDateTime.now());
        carrinhoRepository.save(carrinho);
    }

    private CarrinhoEntity criarCarrinhoParaUsuario(String idUsuario) {
        AcessoEntity usuario = acessoRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        var novoCarrinho = new CarrinhoEntity();
        novoCarrinho.setAcesso(usuario);
        novoCarrinho.setDataCriacao(LocalDateTime.now());
        novoCarrinho.setDataAtualizacao(LocalDateTime.now());

        return carrinhoRepository.save(novoCarrinho);
    }
}