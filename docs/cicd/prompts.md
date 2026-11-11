# Registro do uso de IA

## 1 — Planejamento da CI/CD
Solicitação: mapear pipelines, arquivos YAML, validações Java/SQL/frontend, CD condicionado à CI e roteiro de evidências. Resultado: o arquivo de especificação `plano_ci_cd_para_ia(1).md` fornecido pelo usuário.

## 2 — Preparar a implementação para o DolceLou
Solicitação: executar o plano no repositório. IA auditou Java 21/Spring Boot/PostgreSQL e frontend estático e preparou 20 alterações; testes Python de deploy: 5 aprovados localmente. Problema: integração sem acesso à conta pessoal, HTTP 403 ao tentar criar branch.

## 3 — Configurar acesso ao GitHub
Usuário solicitou implementação direta e posteriormente habilitou o aplicativo GitHub para `LeticiaFavoretto`. A IA verificou a instalação da conta e criou a branch `feat/ci-cd`.

## 4 — "tenta agora"
A IA publicou a implementação em commits na branch, abriu PR #1 e acompanhou a primeira CI.
- Pull request: https://github.com/LeticiaFavoretto/DolceLou/pull/1
- Ação: https://github.com/LeticiaFavoretto/DolceLou/actions/runs/43117992036
- Resultado real: Java/PostgreSQL e frontend aprovados; artifact Surefire/JaCoCo publicado; deploy ignorado corretamente no PR.
- Correções: retirar senha literal do arquivo de configuração, adotar variáveis de ambiente, alinhar Docker/porta, adicionar testes.
- Não realizado: merge, rotação da credencial exposta (manual), configuração do Render/secrets (manual), deploy produção.

Responsabilidade: alterações de código e documentação pela IA; autorização da instalação GitHub pelo usuário; credenciais e publicação de produção exigem decisão e configuração externa.

**Registros futuros:** incluir nova interação e URL dos novos runs, falhas corrigidas e evidências de deploy real.
