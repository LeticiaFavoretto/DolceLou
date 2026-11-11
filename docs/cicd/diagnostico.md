# Diagnóstico de CI/CD — DolceLou

Auditoria: 11/11/2026. Repositório: https://github.com/LeticiaFavoretto/DolceLou, base main.

## Estrutura confirmada

- Java 21, Spring Boot 3.5.15, Maven Wrapper na raiz (`pom.xml`, `mvnw`), Spring MVC/Security, Spring Data JPA, driver PostgreSQL.
- Frontend HTML/CSS/JavaScript estático em `src/main/resources/static/`, servido pelo Spring; sem `frontend/` ou `package.json`.
- Existia somente `DolcelouApplicationTests.contextLoads()`; foram adicionados testes JUnit/Mockito de produto, saúde e conexão SQL.
- `docker-compose.yaml` define PostgreSQL 17 local. Não há migrations versionadas identificadas.
- `Dockerfile` original pulava testes e declarava porta 8080 apesar da configuração Spring em 8082.
- `application.yaml` original continha uma credencial PostgreSQL literal (não reproduzida neste documento).

## Estratégia

CI em PR e push para main: Maven/JUnit/JaCoCo com Postgres 17 efêmero; Node valida sintaxe JS e Python verifica assets HTML. O deploy depende de ambos os jobs e ocorre somente no push main quando habilitado explicitamente.

Render é uma **opção preparada**: há evidência de host PostgreSQL Render, mas não da URL/ID de um web service existente. O CD utiliza API Render com commit SHA exato, monitoramento de status e health HTTP.

## Limitações e riscos

- A credencial antes versionada deve ser **rotacionada** e seus acessos revistos; o novo commit não remove credenciais dos commits antigos.
- Teste SQL `SELECT 1` comprova conexão, mas ainda não verifica CRUD/migrations.
- Sem dados de serviço Render, chave da API e URL pública, deploy fica desabilitado e não pode ser declarado concluído.
- A validação final depende de registros reais da aba Actions e logs do Render.
