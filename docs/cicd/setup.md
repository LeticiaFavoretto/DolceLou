# Configuração e ativação

## 1. Revisão e testes no GitHub

1. Abra o pull request `feat/ci-cd` para `main`.
2. Confira na aba **Checks/Actions** se `backend` e `frontend` passaram. Se falharem, verifique os logs; não use `-DskipTests`.
3. Consulte os artifacts `dolcelou-java-reports` para relatórios Surefire e JaCoCo.
4. Proteja a branch `main` exigindo os jobs de CI antes de merge (Settings > Rules/Branches).
5. Não faça merge antes da revisão e da configuração de ambiente.

## 2. Segurança e banco

A versão original do `src/main/resources/application.yaml` continha credenciais fixas. **Revogue e substitua a senha imediatamente**, pois o histórico do Git continua contendo o valor. Investigue eventuais usos indevidos e atualize todas as instâncias que utilizam a credencial.

Configure no serviço Java as variáveis `DB_URL` (JDBC PostgreSQL), `DB_USERNAME` e `DB_PASSWORD`. Exemplo de URL não sensível: `jdbc:postgresql://host:5432/database`. O arquivo `application.yaml` agora lê variáveis; jamais publique segredos no Git.

## 3. Render (somente depois de validar a CI)

1. Identifique/crie um **Render Web Service** conectado ao GitHub `LeticiaFavoretto/DolceLou`, usando `Dockerfile` na raiz.
2. Configure nele `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` com valores reais seguros, e `PORT=8080` se necessário.
3. Desative o auto-deploy nativo do Render; o GitHub Actions deve decidir quando publicar.
4. No GitHub: Settings > Secrets and variables > Actions:
   - **Secret** `RENDER_API_KEY`: token Render válido com acesso ao serviço.
   - **Variable** `RENDER_SERVICE_ID`: ID do **Web Service** (formato `srv-...`), não do banco.
   - **Variable** `RENDER_PUBLIC_URL`: URL HTTPS pública da aplicação, sem sufixo.
   - **Variable** `RENDER_DEPLOY_ENABLED`: `true` apenas quando toda a configuração acima estiver pronta.
5. Configure/revise o environment `production` se necessário.
6. Faça merge somente quando a CI estiver verde e o deploy estiver devidamente autorizado.
7. No push main, o job fará deploy **do SHA aprovado**, aguardará status `live`, confirmará SHA e testará `GET /actuator/health` com status `UP`.

Sem `RENDER_DEPLOY_ENABLED=true`, o job `deploy` ficará **skipped**. É uma proteção intencional, não comprovação de CD funcional.

Referências: https://api-docs.render.com/reference/create-deploy e https://api-docs.render.com/reference/retrieve-deploy.

## 4. Execução local

```bash
bash ./mvnw -B -ntp clean verify
find src/main/resources/static/js -name '*.js' -print0 | xargs -0 -r -n1 node --check
python3 scripts/check_static_assets.py
python3 -m unittest discover -s scripts -p 'test_*.py' -v
```
