package com.dolcelou.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarrinhoResumoDto {

    private Integer quantidadeItens;
    private Integer quantidadeProdutos;
    private BigDecimal total;
}
