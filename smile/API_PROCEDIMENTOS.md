# API de procedimentos

Essa API gerencia o **catálogo** de procedimentos (nome, descrição e preço). A tela atual de `procedimentos.html` mostra atendimentos fictícios com paciente, dentista e status; a integração dessa tela exige o fluxo de consultas/tratamentos.

Com o SQL Server em execução, inicie o backend na pasta `smile`:

```bash
bash -c 'set -a; source .env; set +a; ./mvnw spring-boot:run'
```

O Spring ainda gera uma senha temporária para o usuário `user` e a imprime no terminal. Em outro terminal, `curl -u user` solicita essa senha sem gravá-la no comando. Exemplos:

```bash
curl http://localhost:8080/api/health
curl -u user http://localhost:8080/api/procedimentos
curl -u user -H 'Content-Type: application/json' \
  -d '{"nome":"Limpeza","descricao":"Profilaxia","preco":150.00}' \
  http://localhost:8080/api/procedimentos
```

O `POST` retorna `201 Created`, o `Location` do recurso e o `idProcedimento` no JSON. Para um ID existente, use `GET`, `PUT` ou `DELETE` em `/api/procedimentos/{id}`. O preço deve ser maior ou igual a zero. IDs inexistentes retornam `404`; entradas inválidas retornam `400`; conflitos de integridade retornam `409`.

Essas chamadas manuais gravam no banco. Os testes de `./mvnw test` revertem os registros criados durante a execução.
