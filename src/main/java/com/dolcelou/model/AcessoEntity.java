package com.dolcelou.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "acesso")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AcessoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    String id;

    @Column(nullable = false)
    String email;

    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Acesso acesso;

    public enum Acesso {
        FUNCIONARIO,
        COMPRADOR
    }
}
