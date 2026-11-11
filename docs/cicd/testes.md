# Plano e resultados de testes

| ID | Caso | Status | Evidência |
|---|---|---|---|
| T01 | PR executa backend e frontend | **Aprovado** | https://github.com/LeticiaFavoretto/DolceLou/actions/runs/43117992036 |
| T02 | Falha controlada de JUnit em branch | Pendente | Abrir PR de teste e capturar log |
| T03 | Build quebrado controladamente em branch | Pendente | Job falho, sem merge |
| T04 | Sintaxe JavaScript inválida em branch | Pendente | Job frontend falho |
| T05 | Banco efêmero e `SELECT 1` | **Aprovado** | Job Java/PostgreSQL no run #1 |
| T06 | PR não deve publicar produção | **Aprovado** | Job deploy skipped no run #1 |
| T07 | Push main dispara CD após CI | Pendente | Requer merge autorizado e Render configurado |
| T08 | Saúde do serviço publicado | Pendente | URL pública e HTTP 200 `UP` |
| T09 | SHA do deploy igual ao CI | Pendente | Logs do Render |

## Testes automatizados adicionados

- ProdutoServiceTest: seis cenários unitários JUnit/Mockito.
- DolcelouApplicationTests: teste de conexão SQL e health do Actuator em contexto Spring.
- TestRenderDeploy: cinco cenários simulados sem credenciais reais.
- Node `--check` para os arquivos JS e validação de referências de assets no HTML.
- JaCoCo: relatório gerado como artifact `dolcelou-java-reports`.

**CI real verde em 11/11/2026:** https://github.com/LeticiaFavoretto/DolceLou/actions/runs/43117992036

**Não execute falhas deliberadas na main.** Use PR/branch temporária e restaure o código após coletar evidência.
