# Banco local PureSmile

`schema.sql` segue o MLR corrigido: oito tabelas, IDs `BIGINT`, `Tratamento` ligado a `Consulta` e associação `TratamentoProcedimento`. Inclui `Usuario.role` e os campos de pagamento do backend. Não insere dados de exemplo.

Execute **uma vez**, somente em um banco `puresmile` vazio. O script recusa uma base que já contém tabelas.

```bash
cd smile
bash -c 'set -a; source .env; set +a; docker compose up -d; docker compose exec -T -e SQLCMDPASSWORD="$DB_PASSWORD" sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -d puresmile -b -i /dev/stdin < db/schema.sql'
```

Para validar os repositórios, com o container em execução e o `.env` preenchido:

```bash
./mvnw test
```

O teste de integração lê o `.env` local quando as variáveis `DB_*` não estão exportadas, abre uma transação e a reverte; os registros de teste não ficam no banco. O login, as rotas REST e a integração de pagamentos externa ainda são etapas separadas.
