package com.dolcelou.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dolcelou.model.AcessoEntity;

import java.util.Optional;

@Repository
public interface AcessoRepository extends JpaRepository<AcessoEntity, String>{
    Optional<AcessoEntity> findByEmail(String email);
}
