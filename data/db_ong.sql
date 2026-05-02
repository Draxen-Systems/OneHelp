-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 02/05/2026 às 18:25
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `db_ong`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_animais`
--

CREATE TABLE `tb_animais` (
  `ANI_ID` int(11) NOT NULL,
  `ANI_NOME` varchar(100) NOT NULL,
  `ANI_ESPECIE` int(11) NOT NULL,
  `ANI_SEXO` char(1) DEFAULT NULL,
  `ANI_RACA` int(11) DEFAULT NULL,
  `ANI_ATIVO` tinyint(1) NOT NULL DEFAULT 1,
  `ANI_DATA_RESGATE` date DEFAULT NULL,
  `ANI_PORTE` int(11) DEFAULT NULL,
  `ANI_CASTRADO` tinyint(1) NOT NULL DEFAULT 0,
  `ANI_PCD` tinyint(1) NOT NULL DEFAULT 0,
  `ANI_DEFICIENCIA` int(11) DEFAULT NULL,
  `ANI_DONO` tinyint(1) NOT NULL DEFAULT 0,
  `ANI_OBSERVACAO` text DEFAULT NULL,
  `ANI_HISTORIA` text DEFAULT NULL,
  `ANI_CLIENTE` int(11) DEFAULT NULL,
  `ANI_FOTO` text DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_cliente`
--

CREATE TABLE `tb_cliente` (
  `CLI_ID` int(11) NOT NULL,
  `CLI_NOME` varchar(150) NOT NULL,
  `CLI_CPF` varchar(14) NOT NULL,
  `CLI_ENDERECO` varchar(200) DEFAULT NULL,
  `CLI_NUMERO` varchar(10) DEFAULT NULL,
  `CLI_TELEFONE` varchar(20) DEFAULT NULL,
  `CLI_EMAIL` varchar(150) DEFAULT NULL,
  `CLI_DATA` date DEFAULT NULL,
  `CLI_ATIVO` tinyint(1) NOT NULL DEFAULT 1,
  `CLI_OBSERVACOES` text DEFAULT NULL,
  `CLI_CEP` varchar(9) DEFAULT NULL,
  `CLI_BAIRRO` varchar(100) DEFAULT NULL,
  `CLI_UF` char(2) DEFAULT NULL,
  `CLI_PESSOAS` smallint(6) DEFAULT NULL,
  `CLI_TIPO_RESIDENCIA` int(11) DEFAULT NULL,
  `CLI_NASCIMENTO` date DEFAULT NULL,
  `CLI_PCD` tinyint(1) NOT NULL DEFAULT 0,
  `CLI_DEFICIENCIA` int(11) DEFAULT NULL,
  `CLI_FOTO` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_deficiencia`
--

CREATE TABLE `tb_deficiencia` (
  `DEF_ID` int(11) NOT NULL,
  `DEF_NOME` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `tb_deficiencia`
--

INSERT INTO `tb_deficiencia` (`DEF_ID`, `DEF_NOME`) VALUES
(2, 'Auditiva'),
(4, 'Intelectual'),
(3, 'Motora'),
(5, 'Múltipla'),
(6, 'Outra'),
(1, 'Visual');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_especie`
--

CREATE TABLE `tb_especie` (
  `ESP_ID` int(11) NOT NULL,
  `ESP_NOME` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `tb_especie`
--

INSERT INTO `tb_especie` (`ESP_ID`, `ESP_NOME`) VALUES
(3, 'Ave'),
(1, 'Cão'),
(2, 'Gato'),
(5, 'Outro'),
(4, 'Roedor');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_funcao`
--

CREATE TABLE `tb_funcao` (
  `FNC_ID` int(11) NOT NULL,
  `FNC_NOME` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `tb_funcao`
--

INSERT INTO `tb_funcao` (`FNC_ID`, `FNC_NOME`) VALUES
(1, 'Administrador'),
(3, 'Atendente'),
(5, 'Auxiliar'),
(2, 'Veterinário'),
(4, 'Voluntário');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_funcionario`
--

CREATE TABLE `tb_funcionario` (
  `FUN_ID` int(11) NOT NULL,
  `FUN_NOME` varchar(150) NOT NULL,
  `FUN_CPF` varchar(14) NOT NULL,
  `FUN_NASCIMENTO` date DEFAULT NULL,
  `FUN_EMAIL` varchar(150) DEFAULT NULL,
  `FUN_FUNCAO` int(11) DEFAULT NULL,
  `FUN_ACESSO` smallint(6) NOT NULL DEFAULT 1,
  `FUN_TELEFONE` varchar(20) DEFAULT NULL,
  `FUN_PCD` tinyint(1) NOT NULL DEFAULT 0,
  `FUN_DEFICIENCIA` int(11) DEFAULT NULL,
  `FUN_CEP` varchar(9) DEFAULT NULL,
  `FUN_ENDERECO` varchar(200) DEFAULT NULL,
  `FUN_BAIRRO` varchar(100) DEFAULT NULL,
  `FUN_UF` char(2) DEFAULT NULL,
  `FUN_NUMERO` varchar(10) DEFAULT NULL,
  `FUN_DATA_ENTRADA` date DEFAULT NULL,
  `FUN_LOGIN` varchar(80) NOT NULL,
  `FUN_SENHA` varchar(255) NOT NULL,
  `FUN_DISPONIBILIDADE` tinyint(1) NOT NULL DEFAULT 1,
  `FUN_OBSERVACAO` text DEFAULT NULL,
  `FUN_FOTO` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_porte`
--

CREATE TABLE `tb_porte` (
  `POR_ID` int(11) NOT NULL,
  `POR_NOME` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `tb_porte`
--

INSERT INTO `tb_porte` (`POR_ID`, `POR_NOME`) VALUES
(4, 'Gigante'),
(3, 'Grande'),
(2, 'Médio'),
(1, 'Pequeno');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_raca`
--

CREATE TABLE `tb_raca` (
  `RAC_ID` int(11) NOT NULL,
  `RAC_NOME` varchar(100) NOT NULL,
  `RAC_ESPECIE` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_tipo_residencia`
--

CREATE TABLE `tb_tipo_residencia` (
  `TRS_ID` int(11) NOT NULL,
  `TRS_NOME` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `tb_tipo_residencia`
--

INSERT INTO `tb_tipo_residencia` (`TRS_ID`, `TRS_NOME`) VALUES
(2, 'Apartamento'),
(1, 'Casa'),
(4, 'Outro'),
(3, 'Sítio / Chácara');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `tb_animais`
--
ALTER TABLE `tb_animais`
  ADD PRIMARY KEY (`ANI_ID`),
  ADD KEY `fk_ani_especie` (`ANI_ESPECIE`),
  ADD KEY `fk_ani_raca` (`ANI_RACA`),
  ADD KEY `fk_ani_porte` (`ANI_PORTE`),
  ADD KEY `fk_ani_deficiencia` (`ANI_DEFICIENCIA`),
  ADD KEY `fk_ani_cliente` (`ANI_CLIENTE`);

--
-- Índices de tabela `tb_cliente`
--
ALTER TABLE `tb_cliente`
  ADD PRIMARY KEY (`CLI_ID`),
  ADD UNIQUE KEY `uq_cli_cpf` (`CLI_CPF`),
  ADD UNIQUE KEY `uq_cli_email` (`CLI_EMAIL`),
  ADD KEY `fk_cli_tipo_residencia` (`CLI_TIPO_RESIDENCIA`),
  ADD KEY `fk_cli_deficiencia` (`CLI_DEFICIENCIA`);

--
-- Índices de tabela `tb_deficiencia`
--
ALTER TABLE `tb_deficiencia`
  ADD PRIMARY KEY (`DEF_ID`),
  ADD UNIQUE KEY `uq_def_nome` (`DEF_NOME`);

--
-- Índices de tabela `tb_especie`
--
ALTER TABLE `tb_especie`
  ADD PRIMARY KEY (`ESP_ID`),
  ADD UNIQUE KEY `uq_esp_nome` (`ESP_NOME`);

--
-- Índices de tabela `tb_funcao`
--
ALTER TABLE `tb_funcao`
  ADD PRIMARY KEY (`FNC_ID`),
  ADD UNIQUE KEY `uq_fnc_nome` (`FNC_NOME`);

--
-- Índices de tabela `tb_funcionario`
--
ALTER TABLE `tb_funcionario`
  ADD PRIMARY KEY (`FUN_ID`),
  ADD UNIQUE KEY `uq_fun_cpf` (`FUN_CPF`),
  ADD UNIQUE KEY `uq_fun_login` (`FUN_LOGIN`),
  ADD KEY `fk_fun_funcao` (`FUN_FUNCAO`),
  ADD KEY `fk_fun_deficiencia` (`FUN_DEFICIENCIA`);

--
-- Índices de tabela `tb_porte`
--
ALTER TABLE `tb_porte`
  ADD PRIMARY KEY (`POR_ID`),
  ADD UNIQUE KEY `uq_por_nome` (`POR_NOME`);

--
-- Índices de tabela `tb_raca`
--
ALTER TABLE `tb_raca`
  ADD PRIMARY KEY (`RAC_ID`),
  ADD UNIQUE KEY `uq_rac_nome_esp` (`RAC_NOME`,`RAC_ESPECIE`),
  ADD KEY `fk_rac_especie` (`RAC_ESPECIE`);

--
-- Índices de tabela `tb_tipo_residencia`
--
ALTER TABLE `tb_tipo_residencia`
  ADD PRIMARY KEY (`TRS_ID`),
  ADD UNIQUE KEY `uq_trs_nome` (`TRS_NOME`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `tb_animais`
--
ALTER TABLE `tb_animais`
  MODIFY `ANI_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_cliente`
--
ALTER TABLE `tb_cliente`
  MODIFY `CLI_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_deficiencia`
--
ALTER TABLE `tb_deficiencia`
  MODIFY `DEF_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `tb_especie`
--
ALTER TABLE `tb_especie`
  MODIFY `ESP_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `tb_funcao`
--
ALTER TABLE `tb_funcao`
  MODIFY `FNC_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `tb_funcionario`
--
ALTER TABLE `tb_funcionario`
  MODIFY `FUN_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_porte`
--
ALTER TABLE `tb_porte`
  MODIFY `POR_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `tb_raca`
--
ALTER TABLE `tb_raca`
  MODIFY `RAC_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_tipo_residencia`
--
ALTER TABLE `tb_tipo_residencia`
  MODIFY `TRS_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `tb_animais`
--
ALTER TABLE `tb_animais`
  ADD CONSTRAINT `fk_ani_cliente` FOREIGN KEY (`ANI_CLIENTE`) REFERENCES `tb_cliente` (`CLI_ID`),
  ADD CONSTRAINT `fk_ani_deficiencia` FOREIGN KEY (`ANI_DEFICIENCIA`) REFERENCES `tb_deficiencia` (`DEF_ID`),
  ADD CONSTRAINT `fk_ani_especie` FOREIGN KEY (`ANI_ESPECIE`) REFERENCES `tb_especie` (`ESP_ID`),
  ADD CONSTRAINT `fk_ani_porte` FOREIGN KEY (`ANI_PORTE`) REFERENCES `tb_porte` (`POR_ID`),
  ADD CONSTRAINT `fk_ani_raca` FOREIGN KEY (`ANI_RACA`) REFERENCES `tb_raca` (`RAC_ID`);

--
-- Restrições para tabelas `tb_cliente`
--
ALTER TABLE `tb_cliente`
  ADD CONSTRAINT `fk_cli_deficiencia` FOREIGN KEY (`CLI_DEFICIENCIA`) REFERENCES `tb_deficiencia` (`DEF_ID`),
  ADD CONSTRAINT `fk_cli_tipo_residencia` FOREIGN KEY (`CLI_TIPO_RESIDENCIA`) REFERENCES `tb_tipo_residencia` (`TRS_ID`);

--
-- Restrições para tabelas `tb_funcionario`
--
ALTER TABLE `tb_funcionario`
  ADD CONSTRAINT `fk_fun_deficiencia` FOREIGN KEY (`FUN_DEFICIENCIA`) REFERENCES `tb_deficiencia` (`DEF_ID`),
  ADD CONSTRAINT `fk_fun_funcao` FOREIGN KEY (`FUN_FUNCAO`) REFERENCES `tb_funcao` (`FNC_ID`);

--
-- Restrições para tabelas `tb_raca`
--
ALTER TABLE `tb_raca`
  ADD CONSTRAINT `fk_rac_especie` FOREIGN KEY (`RAC_ESPECIE`) REFERENCES `tb_especie` (`ESP_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
