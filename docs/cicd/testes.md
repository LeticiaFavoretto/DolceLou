# Testes e evidências

| ID | Validação | Resultado esperado |
|---|---|---|
| T01 | Abrir PR para main | CI backend e frontend executam; sem deploy |
| T02 | Teste JUnit propositalmente inválido em branch temporária | Backend falha |
| T03 | Erro sintático Java em branch temporária | Build falha |
| T04 | JavaScript inválido em branch temporária | Frontend falha |
| T05 | PostgreSQL descartável no job | `SELECT 1` retorna 1 no teste |
| T06 | Falha de CI | Deploy não inicia |
| T07 | Merge aprovado em main | CI verde seguida do CD (se habilitado) |
| T08 | URL pública após deploy | HTTP 200, `{"status":"UP"}` |
| T09 | SHA | Commit no Render corresponde ao commit da CI |

## Estado inicial

- Tests Python em `scripts/test_render_deploy.py` simulam casos de erro de configuração, falha no deploy, SHA divergente, health UP e health DOWN. Execução local: 5 testes aprovados.
- YAML/XML e scripts tiveram validação sintática na preparação.
- Testes Java com Maven, PostgreSQL e workflows precisam ser verificados na aba Actions após abertura do PR.
- Sem credenciais Render não há deploy real; não considere T07–T09 satisfeitos.
- Não injete falhas na main de produção: use branches e PRs temporários, registre capturas e descarte os erros.
