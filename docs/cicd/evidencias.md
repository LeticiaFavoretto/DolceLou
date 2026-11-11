# Evidências reais da implementação

## PR e CI (11/11/2026)

- Repositório: https://github.com/LeticiaFavoretto/DolceLou
- Pull request **#1**: https://github.com/LeticiaFavoretto/DolceLou/pull/1
- Branch: `feat/ci-cd` -> `main`; criada e publicada, sem merge.
- Execução real de CI **#1**: https://github.com/LeticiaFavoretto/DolceLou/actions/runs/43117992036
- SHA validado nesta execução: `6c05df7df6ce64efdeb63677222a52fd546bd10f`.
- **Backend**: `Java 21 / Maven / PostgreSQL / JaCoCo` — success. Compilação/testes e upload de relatórios aprovados.
- **Frontend**: `JavaScript syntax and HTML assets` — success. Verificações de sintaxe JS, assets HTML e testes Python aprovados.
- Artifact: `dolcelou-java-reports` (Surefire/JaCoCo), disponível no run #1.
- **Deploy**: skipped, porque o evento foi `pull_request`; comportamento esperado. Render ainda **não foi configurado nem acionado**.

Observação: alterações na documentação após essa execução podem gerar novos runs. Registre também o último run antes de finalizar o relatório.

## Evidências ainda pendentes

1. Teste de falha controlada em branch temporária: job falha e deploy não inicia.
2. Rotação da senha PostgreSQL que estava versionada na main/histórico.
3. Configuração do Render Web Service e dos secrets/variables no GitHub.
4. Merge da PR após aprovação e execução da CI em push main.
5. CD efetivo no Render, URL pública, `/actuator/health` com `{"status":"UP"}`, e SHA idêntico ao commit aprovado.
6. PDF acadêmico único com YAML, prompts, análises, links e capturas verdadeiras.

Não confundir deploy skipped em PR com deployment concluído.
