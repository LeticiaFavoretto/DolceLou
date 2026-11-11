package com.dolcelou.model;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "produto")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProdutoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    String id;

    @Column(nullable = false)
    String nome;

    @Column(nullable = false)
    BigDecimal preco;

    @Column(nullable = false)
    String medida;

    @Column(nullable = false)
    String descricao;

    @Column(nullable = false)
    double quantidade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Categoria categoria;

    public enum Categoria {
        bolo,
        massa,
        salgado
    }
}
