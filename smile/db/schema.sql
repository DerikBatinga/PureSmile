-- PureSmile: esquema SQL Server baseado no MLR corrigido.
-- Execute uma vez em uma base vazia. Sem dados ficticios ou comandos destrutivos.
:ON ERROR EXIT
SET XACT_ABORT ON;
IF EXISTS (SELECT 1 FROM sys.tables WHERE schema_id = SCHEMA_ID('dbo'))
    THROW 50001, 'A base ja contem tabelas. Esquema nao aplicado.', 1;
GO

BEGIN TRANSACTION;

CREATE TABLE dbo.Usuario (
    id_usuario BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nome NVARCHAR(150) NOT NULL,
    email NVARCHAR(254) NOT NULL UNIQUE,
    senha NVARCHAR(255) NOT NULL,
    role NVARCHAR(30) NOT NULL,
    ativo BIT NOT NULL DEFAULT (1),
    data_criacao DATETIME2(0) NOT NULL DEFAULT (SYSDATETIME())
);

CREATE TABLE dbo.Convenio (
    id_convenio BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nome NVARCHAR(150) NOT NULL,
    email NVARCHAR(254) NULL,
    cnpj CHAR(14) NULL UNIQUE,
    ativo BIT NOT NULL DEFAULT (1),
    cobertura_descricao NVARCHAR(1000) NULL,
    telefone NVARCHAR(20) NULL
);

CREATE TABLE dbo.Paciente (
    id_paciente BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    id_usuario BIGINT NOT NULL UNIQUE REFERENCES dbo.Usuario(id_usuario),
    cpf CHAR(11) NOT NULL UNIQUE,
    sexo NVARCHAR(30) NULL,
    telefone NVARCHAR(20) NULL,
    data_nasc DATE NULL,
    id_convenio BIGINT NULL REFERENCES dbo.Convenio(id_convenio)
);

CREATE TABLE dbo.Dentista (
    id_dentista BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    id_usuario BIGINT NOT NULL UNIQUE REFERENCES dbo.Usuario(id_usuario),
    cro NVARCHAR(30) NOT NULL UNIQUE,
    telefone NVARCHAR(20) NULL,
    especialidade NVARCHAR(100) NULL
);

CREATE TABLE dbo.Procedimento (
    id_procedimento BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nome NVARCHAR(150) NOT NULL,
    descricao NVARCHAR(1000) NULL,
    valor DECIMAL(10,2) NOT NULL CHECK (valor >= 0)
);

CREATE TABLE dbo.Consulta (
    id_consulta BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    data_hora DATETIME2(0) NOT NULL,
    status NVARCHAR(30) NOT NULL,
    observacoes NVARCHAR(1000) NULL,
    id_paciente BIGINT NOT NULL REFERENCES dbo.Paciente(id_paciente),
    id_dentista BIGINT NOT NULL REFERENCES dbo.Dentista(id_dentista)
);

CREATE TABLE dbo.Tratamento (
    id_tratamento BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    id_consulta BIGINT NOT NULL REFERENCES dbo.Consulta(id_consulta),
    nome NVARCHAR(150) NOT NULL,
    descricao NVARCHAR(1000) NULL,
    status NVARCHAR(30) NOT NULL,
    data_inicio DATETIME2(0) NULL,
    data_fim DATETIME2(0) NULL,
    id_paciente BIGINT NOT NULL REFERENCES dbo.Paciente(id_paciente),
    valor_pago DECIMAL(10,2) NULL CHECK (valor_pago >= 0),
    data_pagamento DATETIME2(0) NULL,
    CONSTRAINT CK_Tratamento_datas CHECK (data_fim IS NULL OR data_inicio IS NULL OR data_fim >= data_inicio)
);

CREATE TABLE dbo.TratamentoProcedimento (
    id_tratamento BIGINT NOT NULL REFERENCES dbo.Tratamento(id_tratamento),
    id_procedimento BIGINT NOT NULL REFERENCES dbo.Procedimento(id_procedimento),
    quantidade INT NOT NULL DEFAULT (1) CHECK (quantidade > 0),
    PRIMARY KEY (id_tratamento, id_procedimento)
);

CREATE INDEX IX_Consulta_paciente_data ON dbo.Consulta(id_paciente, data_hora);
CREATE INDEX IX_Consulta_dentista_data ON dbo.Consulta(id_dentista, data_hora);
CREATE INDEX IX_Tratamento_paciente ON dbo.Tratamento(id_paciente);

COMMIT TRANSACTION;
GO
