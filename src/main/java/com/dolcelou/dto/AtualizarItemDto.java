package com.dolcelou.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AtualizarItemDto {
    private String idProduto;
    private Integer quantidade;
}
