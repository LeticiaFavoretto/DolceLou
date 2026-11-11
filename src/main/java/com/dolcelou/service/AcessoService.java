package com.dolcelou.service;

import org.springframework.stereotype.Service;
import com.dolcelou.model.AcessoEntity;
import com.dolcelou.repository.AcessoRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class AcessoService {

    private final AcessoRepository acessoRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AcessoEntity> findAll() {
        return acessoRepository.findAll();
    }

    public AcessoEntity saveAcess(AcessoEntity acesso) {
        acesso.setSenha(passwordEncoder.encode(acesso.getSenha()));
        return acessoRepository.save(acesso);
    }

    public AcessoEntity getAcessById(String id) {
        return acessoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Não foi possível achar um produto com esse id"));
    }

    public AcessoEntity login(String email, String senha) {
        var acesso = acessoRepository.findByEmail(email)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("email inválido"));

        boolean senhaValida = passwordEncoder.matches(senha, acesso.getSenha()) || acesso.getSenha().equals(senha);
        if (senhaValida) {
            if (!acesso.getSenha().startsWith("$2a$") && !acesso.getSenha().startsWith("$2b$") && !acesso.getSenha().startsWith("$2y$")) {
                acesso.setSenha(passwordEncoder.encode(senha));
                acessoRepository.save(acesso);
            }
            return acesso;
        }
        else {
            throw new RuntimeException("email ou senha inválido");
        }
    }

    public AcessoEntity updateById(String id, AcessoEntity entity) {
        var acesso = acessoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Não foi possível achar um produto com esse id"));
        return acessoRepository.save(entity);
    }

    public void deleteAcessById(String id) {
        acessoRepository.deleteById(id);
    }
}
