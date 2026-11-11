package com.dolcelou.repository;

import com.dolcelou.model.CarrinhoItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CarrinhoItemRepository extends JpaRepository<CarrinhoItemEntity, Integer> {
    Optional<CarrinhoItemEntity> findByCarrinhoIdAndProdutoId(String carrinhoId, String produtoId);
}