-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql-db
-- Généré le : lun. 22 juil. 2024 à 11:16
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `your_database`
--

-- --------------------------------------------------------

--
-- Structure de la table `ag`
--

CREATE TABLE `ag` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL,
  `agenda` varchar(255) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ag_email`
--

CREATE TABLE `ag_email` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `agId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `document`
--

CREATE TABLE `document` (
  `id` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `fileUrl` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `originalName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `document_log`
--

CREATE TABLE `document_log` (
  `id` int NOT NULL,
  `changeDescription` varchar(255) NOT NULL,
  `timestamp` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `documentId` int DEFAULT NULL,
  `userId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `survey`
--

CREATE TABLE `survey` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` int DEFAULT NULL,
  `deadline` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `survey_question`
--

CREATE TABLE `survey_question` (
  `id` int NOT NULL,
  `questionText` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `options` text,
  `surveyId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `survey_response`
--

CREATE TABLE `survey_response` (
  `id` int NOT NULL,
  `responses` text NOT NULL,
  `surveyId` int DEFAULT NULL,
  `userId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `token`
--

CREATE TABLE `token` (
  `id` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `userId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rolesId` int DEFAULT NULL,
  `contribution` tinyint NOT NULL,
  `toUpdateOn` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `vote`
--

CREATE TABLE `vote` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `createdById` int DEFAULT NULL,
  `mode` varchar(255) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `deadline` datetime NOT NULL,
  `majority` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `vote_option`
--

CREATE TABLE `vote_option` (
  `id` int NOT NULL,
  `text` varchar(255) NOT NULL,
  `questionId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `vote_question`
--

CREATE TABLE `vote_question` (
  `id` int NOT NULL,
  `questionText` varchar(255) NOT NULL,
  `voteId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `vote_response`
--

CREATE TABLE `vote_response` (
  `id` int NOT NULL,
  `responses` text NOT NULL,
  `voteId` int DEFAULT NULL,
  `userId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `ag`
--
ALTER TABLE `ag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_0ac12e8c24ad3bea34c2223e453` (`createdById`);

--
-- Index pour la table `ag_email`
--
ALTER TABLE `ag_email`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_357159551bc0346d3f3c2560398` (`agId`);

--
-- Index pour la table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_9eac3612452020c976207f37b03` (`createdById`);

--
-- Index pour la table `document_log`
--
ALTER TABLE `document_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_0ba23c62bb7ab9674e795f8ff71` (`userId`),
  ADD KEY `FK_d8e0951cda369843ff0143fa399` (`documentId`);

--
-- Index pour la table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `survey`
--
ALTER TABLE `survey`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_6a0a4c30d43b29d212748611d3d` (`createdById`);

--
-- Index pour la table `survey_question`
--
ALTER TABLE `survey_question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_036a359b4a0884d113f6232e96d` (`surveyId`);

--
-- Index pour la table `survey_response`
--
ALTER TABLE `survey_response`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_325dc8ed7bbdea328af1670dc0a` (`surveyId`),
  ADD KEY `FK_6f270d46c6b0e0b68373a417c5a` (`userId`);

--
-- Index pour la table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_94f168faad896c0786646fa3d4a` (`userId`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_5493e241ab6c27f36c7f9bae51a` (`rolesId`);

--
-- Index pour la table `vote`
--
ALTER TABLE `vote`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_fee8b791157da492021c4c8fdb7` (`createdById`);

--
-- Index pour la table `vote_option`
--
ALTER TABLE `vote_option`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_b51a2522ecf3af85bfb8f4c545c` (`questionId`);

--
-- Index pour la table `vote_question`
--
ALTER TABLE `vote_question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_f56f6830cfd171cfe833399e129` (`voteId`);

--
-- Index pour la table `vote_response`
--
ALTER TABLE `vote_response`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_de54773d5eb6f45469dfb56c3a3` (`voteId`),
  ADD KEY `FK_50489742c689d7b2dff1723b580` (`userId`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `ag`
--
ALTER TABLE `ag`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `ag_email`
--
ALTER TABLE `ag_email`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `document`
--
ALTER TABLE `document`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `document_log`
--
ALTER TABLE `document_log`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `role`
--
ALTER TABLE `role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `survey`
--
ALTER TABLE `survey`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `survey_question`
--
ALTER TABLE `survey_question`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `survey_response`
--
ALTER TABLE `survey_response`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `token`
--
ALTER TABLE `token`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `vote`
--
ALTER TABLE `vote`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `vote_option`
--
ALTER TABLE `vote_option`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `vote_question`
--
ALTER TABLE `vote_question`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `vote_response`
--
ALTER TABLE `vote_response`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `ag`
--
ALTER TABLE `ag`
  ADD CONSTRAINT `FK_0ac12e8c24ad3bea34c2223e453` FOREIGN KEY (`createdById`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `ag_email`
--
ALTER TABLE `ag_email`
  ADD CONSTRAINT `FK_357159551bc0346d3f3c2560398` FOREIGN KEY (`agId`) REFERENCES `ag` (`id`);

--
-- Contraintes pour la table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `FK_9eac3612452020c976207f37b03` FOREIGN KEY (`createdById`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `document_log`
--
ALTER TABLE `document_log`
  ADD CONSTRAINT `FK_0ba23c62bb7ab9674e795f8ff71` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_d8e0951cda369843ff0143fa399` FOREIGN KEY (`documentId`) REFERENCES `document` (`id`);

--
-- Contraintes pour la table `survey`
--
ALTER TABLE `survey`
  ADD CONSTRAINT `FK_6a0a4c30d43b29d212748611d3d` FOREIGN KEY (`createdById`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `survey_question`
--
ALTER TABLE `survey_question`
  ADD CONSTRAINT `FK_036a359b4a0884d113f6232e96d` FOREIGN KEY (`surveyId`) REFERENCES `survey` (`id`);

--
-- Contraintes pour la table `survey_response`
--
ALTER TABLE `survey_response`
  ADD CONSTRAINT `FK_325dc8ed7bbdea328af1670dc0a` FOREIGN KEY (`surveyId`) REFERENCES `survey` (`id`),
  ADD CONSTRAINT `FK_6f270d46c6b0e0b68373a417c5a` FOREIGN KEY (`userId`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `FK_94f168faad896c0786646fa3d4a` FOREIGN KEY (`userId`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_5493e241ab6c27f36c7f9bae51a` FOREIGN KEY (`rolesId`) REFERENCES `role` (`id`);

--
-- Contraintes pour la table `vote`
--
ALTER TABLE `vote`
  ADD CONSTRAINT `FK_fee8b791157da492021c4c8fdb7` FOREIGN KEY (`createdById`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `vote_option`
--
ALTER TABLE `vote_option`
  ADD CONSTRAINT `FK_b51a2522ecf3af85bfb8f4c545c` FOREIGN KEY (`questionId`) REFERENCES `vote_question` (`id`);

--
-- Contraintes pour la table `vote_question`
--
ALTER TABLE `vote_question`
  ADD CONSTRAINT `FK_f56f6830cfd171cfe833399e129` FOREIGN KEY (`voteId`) REFERENCES `vote` (`id`);

--
-- Contraintes pour la table `vote_response`
--
ALTER TABLE `vote_response`
  ADD CONSTRAINT `FK_50489742c689d7b2dff1723b580` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_de54773d5eb6f45469dfb56c3a3` FOREIGN KEY (`voteId`) REFERENCES `vote` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
