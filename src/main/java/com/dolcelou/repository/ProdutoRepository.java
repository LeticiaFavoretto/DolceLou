package com.dolcelou.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dolcelou.model.ProdutoEntity;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<ProdutoEntity, String>{
    List<ProdutoEntity> findByIdIn(List<String> ids);
}
