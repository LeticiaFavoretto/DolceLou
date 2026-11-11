package com.dolcelou.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dolcelou.model.RelacionamentoEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface RelacionamentoRepository extends JpaRepository<RelacionamentoEntity, String>{

}
