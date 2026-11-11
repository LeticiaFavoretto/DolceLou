# Arquitetura de CI/CD

```text
PR -> backend (Java 21, Maven verify, PostgreSQL 17, JaCoCo) ----+
   -> frontend (Node --check, assets HTML, testes Python) -------+-> checks
                                                                    |
push main -> mesmas verificações -> ambas passaram? -> deploy condicional
                                             (RENDER_DEPLOY_ENABLED=true)
                                                                    |
                                              Render API deploy commitId=SHA
                                                                    |
                                              status live + SHA + health UP
```

## Escopo

- `.github/workflows/ci-cd.yml` contém os jobs independentes `backend` e `frontend`.
- `deploy` usa `needs: [backend, frontend]`; pull requests não publicam produção.
- Sem npm ou framework frontend, nenhuma etapa artificial de build foi adicionada.
- O ambiente de teste SQL é efêmero. Build Docker usa H2 de teste por padrão para não depender de credenciais externas.
- `spring-boot-starter-actuator` expõe apenas o health; a permissão pública está configurada em `SecurityConfig`.
- O Dockerfile usa build multi-stage com `mvn verify`, runtime Java 21 e porta 8080.
- Auto-deploy do Render deve ser desativado para impedir deploy não autorizado antes da CI.
