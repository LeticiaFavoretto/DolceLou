package com.dolcelou.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarrinhoDto {

    private List<CarrinhoItemDto> itens;
    private CarrinhoResumoDto resumo;
}