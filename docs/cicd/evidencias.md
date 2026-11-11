# Evidências da entrega

## Registros necessários

1. Link do pull request da branch `feat/ci-cd` para `main`.
2. Execução do GitHub Actions com jobs `backend` e `frontend` aprovados, mais artifacts de testes e cobertura.
3. Falha controlada de JUnit/JS numa branch temporária e ausência de deploy.
4. Configuração (sem exibir segredos) do Render Web Service e variáveis no GitHub.
5. Execução de CD em push main após CI verde e com a variável de habilitação ativa.
6. URL pública HTTPS, JSON do `GET /actuator/health` e SHA do deploy em Render.
7. Um único PDF com YAML, prompts, modificações, dificuldades, evidências e análise.

**Não substitua evidências reais por prints fictícios.** A existência do YAML, isoladamente, não comprova o deploy.
