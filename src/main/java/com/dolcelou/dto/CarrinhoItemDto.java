package com.dolcelou.dto;

import com.dolcelou.model.ProdutoEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarrinhoItemDto {

    private Integer id;
    private String idProduto;
    private String nomeProduto;
    private ProdutoEntity.Categoria categoria;
    private Integer quantidade;
    private BigDecimal precoUnitario;
    private BigDecimal subtotal;
}
