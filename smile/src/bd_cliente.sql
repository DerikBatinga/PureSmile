SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `puresmile`
--
CREATE DATABASE IF NOT EXISTS puresmile DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE puresmile;

-- --------------------------------------------------------
-- Estrutura das tabelas :)
-- --------------------------------------------------------
CREATE TABLE tb_clinic(
                          id_clinic BIGINT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(50) NOT NULL UNIQUE,
                          cnpj VARCHAR(14) NOT NULL UNIQUE,
                          email VARCHAR(255) NOT NULL,
                          status CHAR NOT NULL DEFAULT 'Y',
                          current_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE tb_insurance(
                             id_insurance BIGINT AUTO_INCREMENT PRIMARY KEY,
                             name VARCHAR(50) NOT NULL UNIQUE,
                             cnpj VARCHAR(14) NOT NULL UNIQUE,
                             email VARCHAR(255) NOT NULL,
                             status CHAR NOT NULL DEFAULT 'Y',
                             current_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE tb_clinic_insurance(
                                    clinic_id BIGINT NOT NULL,
                                    insurance_id BIGINT NOT NULL,
                                    PRIMARY KEY (clinic_id,insurance_id),

                                    FOREIGN KEY (clinic_id) REFERENCES tb_clinic(id_clinic),
                                    FOREIGN KEY (insurance_id) REFERENCES tb_insurance(id_insurance)
);
CREATE TABLE tb_user(
                        id_user BIGINT AUTO_INCREMENT PRIMARY KEY,
                        first_name VARCHAR(50) NOT NULL,
                        second_name VARCHAR(50) NOT NULL,
                        cpf VARCHAR(11) NOT NULL UNIQUE,
                        gender CHAR NOT NULL,
                        birthday DATE NOT NULL,
                        email VARCHAR(50) NOT NULL,
                        status ENUM('ATIVA','DESATIVO') NOT NULL DEFAULT 'ATIVO',
                        current_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_user_address(
                                user_id BIGINT PRIMARY KEY,
                                street_name VARCHAR(50) NOT NULL,
                                house_number VARCHAR(5) NOT NULL,
                                neighborhood VARCHAR(20) NOT NULL,
                                cep VARCHAR(9) NOT NULL,
                                complement VARCHAR(20),

                                FOREIGN KEY (user_id) REFERENCES tb_user(id_user)
);

CREATE TABLE tb_clinic_address(
                                  clinic_id BIGINT PRIMARY KEY,
                                  street_name VARCHAR(50) NOT NULL,
                                  house_number VARCHAR(5) NOT NULL,
                                  neighborhood VARCHAR(20) NOT NULL,
                                  cep VARCHAR(9) NOT NULL,

                                  FOREIGN KEY (clinic_id) REFERENCES tb_clinic(id_clinic)
);

CREATE TABLE tb_dentist (
                            id_dentist BIGINT  AUTO_INCREMENT PRIMARY KEY,
                            user_id BIGINT NOT NULL UNIQUE,
                            clinic_id BIGINT NOT NULL,
                            cro VARCHAR(50) NOT NULL,
                            specialization VARCHAR(30) NOT NULL,

                            FOREIGN KEY (user_id) REFERENCES tb_user(id_user),
                            FOREIGN KEY (clinic_id) REFERENCES tb_clinic(id_clinic)
);

CREATE TABLE tb_employers (
                              id_employee BIGINT AUTO_INCREMENT PRIMARY KEY,
                              user_id BIGINT NOT NULL UNIQUE,
                              work_area VARCHAR(50) NOT NULL,
                              salary INT NOT NULL,

                              FOREIGN KEY (user_id) REFERENCES tb_user(id_user)
);

CREATE TABLE tb_consult(
                           id_consult BIGINT AUTO_INCREMENT PRIMARY KEY,
                           user_id BIGINT NOT NULL,
                           dentist_id BIGINT NOT NULL,
                           consult_date DATETIME NOT NULL,
                           status ENUM('AGENDADA','CANCELADA','CONCLUIDA') NOT NULL DEFAULT 'AGENDADA',

                           FOREIGN KEY (user_id) REFERENCES tb_user(id_user),
                           FOREIGN KEY (dentist_id) REFERENCES tb_dentist(id_dentist)
);

CREATE TABLE tb_payments(
                            id_payments BIGINT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                            consultation_id BIGINT NOT NULL,
                            status_payments CHAR NOT NULL,
                            FOREIGN KEY (consultation_id) REFERENCES tb_consult(id_consult)
);

CREATE TABLE tb_procedure (
                              id_procedure BIGINT PRIMARY KEY AUTO_INCREMENT,
                              diagnostic VARCHAR(20) NOT NULL,
                              description VARCHAR(50) NOT NULL,
                              procedure_value INT NOT NULL
);

CREATE TABLE tb_dental_treatment (
                                     id_treatment BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     consult_id BIGINT NOT NULL,
                                     procedure_id BIGINT NOT NULL,
                                     start_at TIMESTAMP NOT NULL,
                                     end_at DATE NOT NULL,
                                     status ENUM('AGENDADA','CANCELADA','CONCLUIDA') NOT NULL DEFAULT 'AGENDADA',

                                     FOREIGN KEY (consult_id) REFERENCES tb_consult(id_consult),
                                     FOREIGN KEY (procedure_id) REFERENCES tb_procedure(id_procedure)
);


--
-- Extraindo dados da tabela `tbclientes`
--

INSERT INTO tb_user(first_name, second_name, cpf, gender, birthday, email)
VALUES
    ('Antonio','Bernado', '10000000029', 'M', '2003-10-23', 'antonio.bernado0@email.com'),
    ('Ana','Nogueira', '10000003794', 'F', '1996-10-11', 'ana.nogueira1@email.com'),
    ('Guilherme','Izidio', '10000007446', 'M', '1979-01-14', 'guilherme.izidio2@email.com'),
    ('Camila','Araujo', '10000011199', 'F', '1991-06-12', 'camila.araujo3@email.com'),
    ('Pedro','Silva', '10000014811', 'M', '1996-07-04', 'pedro.silva4@email.com'),
    ('Elisa', 'Souza', '10000018512', 'F', '2006-07-27', 'elisa.souza5@email.com'),
    ('Bruno', 'Oliveira', '10000022292', 'M', '1976-01-09', 'bruno.oliveira6@email.com'),
    ('Gabriela', 'Costa', '10000025933', 'F', '1990-07-12', 'gabriela.costa7@email.com'),
    ('Eduardo','Pereira', '10000029620', 'M', '1991-02-17', 'eduardo.pereira8@email.com'),
    ('Isabela', 'Almeida', '10000033389', 'F', '1989-05-05', 'isabela.almeida9@email.com'),
    ('Gabriel', 'Ferreira', '10000037096', 'M', '1991-01-20', 'gabriel.ferreira10@email.com'),
    ('Larissa', 'Rodrigues', '10000040741', 'F', '1984-08-25', 'larissa.rodrigues11@email.com'),
    ('Igor', 'Carvalho', '10000044492', 'M', '1996-05-26', 'igor.carvalho12@email.com'),
    ('Natalia','Gomes', '10000048168', 'F', '1978-12-15', 'natalia.gomes13@email.com'),
    ('Leonardo', 'Martins', '10000051874', 'M', '1977-11-04', 'leonardo.martins14@email.com'),
    ('Renata', 'Rocha', '10000055560', 'F', '1985-07-26', 'renata.rocha15@email.com'),
    ('Nicolas', 'Ribeiro', '10000059239', 'M', '1976-12-12', 'nicolas.ribeiro16@email.com'),
    ('Tainara', 'Alves', '10000062964', 'F', '2005-12-07', 'tainara.alves17@email.com'),
    ('Paulo','Monteiro', '10000066650', 'M', '1979-03-19', 'paulo.monteiro18@email.com'),
    ('Yasmin', 'Cardoso', '10000070348', 'F', '2004-07-15', 'yasmin.cardoso19@email.com'),
    ('Thiago','Bernado', '10000074083', 'M', '1991-04-11', 'thiago.bernado20@email.com'),
    ('Carolina', 'Nogueira', '10000077710', 'F', '1976-03-21', 'carolina.nogueira21@email.com'),
    ('Wesley', 'Izidio', '10000081488', 'M', '1989-04-27', 'wesley.izidio22@email.com'),
    ('Eduarda','Araujo', '10000085142', 'F', '1978-09-26', 'eduarda.araujo23@email.com'),
    ('Diego','Silva', '10000088840', 'M', '1981-02-10', 'diego.silva24@email.com'),
    ('Rafaela','Souza', '10000092530', 'F', '1986-11-15', 'rafaela.souza25@email.com'),
    ('Derik','Oliveira', '10000096259', 'M', '1979-04-25', 'derik.oliveira26@email.com'),
    ('Beatriz','Costa', '10000099995', 'F', '2000-04-12', 'beatriz.costa27@email.com'),
    ('Lucas','Pereira', '10000103632', 'M', '2002-04-24', 'lucas.pereira28@email.com'),
    ('Daniela','Almeida', '10000107365', 'F', '1975-06-18', 'daniela.almeida29@email.com'),
    ('Rafael','Ferreira', '10000111052', 'M', '1975-05-12', 'rafael.ferreira30@email.com'),
    ('Fernanda','Rodrigues', '10000114718', 'F', '1983-03-07', 'fernanda.rodrigues31@email.com'),
    ('Carlos','Carvalho', '10000118448', 'M', '1978-04-09', 'carlos.carvalho32@email.com'),
    ('Helena','Gomes', '10000122180', 'F', '1994-04-16', 'helena.gomes33@email.com'),
    ('Felipe','Martins', '10000125814', 'M', '1976-10-11', 'felipe.martins34@email.com'),
    ('Julia','Rocha', '10000129517', 'F', '1979-05-25', 'julia.rocha35@email.com'),
    ('Henrique','Ribeiro', '10000133211', 'M', '1990-07-08', 'henrique.ribeiro36@email.com'),
    ('Mariana','Alves', '10000136971', 'F', '1977-12-02', 'mariana.alves37@email.com'),
    ('Joao','Monteiro', '10000140644', 'M', '1993-02-01', 'joao.monteiro38@email.com'),
    ('Patricia','Cardoso', '10000144352', 'F', '1985-11-21', 'patricia.cardoso39@email.com'),
    ('Marcelo','Bernado', '10000148068', 'M', '1997-03-10', 'marcelo.bernado40@email.com'),
    ('Sabrina','Nogueira', '10000151730', 'F', '1997-11-13', 'sabrina.nogueira41@email.com'),
    ('Otavio','Izidio', '10000155459', 'M', '1989-09-27', 'otavio.izidio42@email.com'),
    ('Vanessa','Araujo', '10000159141', 'F', '2000-03-24', 'vanessa.araujo43@email.com'),
    ('Rodrigo','Silva', '10000162815', 'M', '1985-08-14', 'rodrigo.silva44@email.com'),
    ('Bianca','Souza', '10000166582', 'F', '1990-07-26', 'bianca.souza45@email.com'),
    ('Vinicius','Oliveira', '10000170225', 'M', '1994-01-17', 'vinicius.oliveira46@email.com'),
    ('Debora','Costa', '10000173970', 'F', '1991-04-19', 'debora.costa47@email.com'),
    ('Alexandre','Pereira', '10000177689', 'M', '1990-01-17', 'alexandre.pereira48@email.com'),
    ('Flavia','Almeida', '10000181357', 'F', '1995-11-23', 'flavia.almeida49@email.com');



--
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;