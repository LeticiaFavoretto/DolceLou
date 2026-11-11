# Arquivos e decisões de implementação

- `.github/workflows/ci-cd.yml`: CI Java/Postgres e frontend estático; deploy Render condicionado aos dois jobs e a push main.
- `.github/dependabot.yml`: atualizações semanais de dependências Maven e GitHub Actions.
- `pom.xml`: adiciona Actuator, H2 de testes e JaCoCo sem mudar a versão Java/Spring Boot.
- `src/main/resources/application.yaml`: substitui senha/host fixos por variáveis de ambiente; restringe Actuator à saúde.
- `src/main/java/com/dolcelou/config/SecurityConfig.java`: permite endpoint de saúde publicamente.
- `src/test/resources/application-test.yaml`: PostgreSQL da CI ou H2 isolado para testes.
- `src/test/java/com/dolcelou/DolcelouApplicationTests.java`: teste de conexão e acesso ao health.
- `src/test/java/com/dolcelou/service/ProdutoServiceTest.java`: testes JUnit/Mockito de produto.
- `scripts/check_static_assets.py`: verifica caminhos locais em páginas HTML.
- `scripts/render_deploy.py` e `scripts/test_render_deploy.py`: gatilho de deploy por SHA, monitoramento e testes simulados.
- `Dockerfile` e `.dockerignore`: build multi-stage que executa testes, runtime menor e porta alinhada.
- `docs/cicd/`: decisões, configuração, roteiro de testes, prompts e evidências.

Mudanças não realizadas: reestruturação do frontend, alterações nas regras de negócio, migração de banco, merges e deploy remoto de produção.
