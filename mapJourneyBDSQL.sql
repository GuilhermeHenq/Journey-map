CREATE DATABASE  IF NOT EXISTS `mapjourney` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mapjourney`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mapjourney
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contactpoint`
--

DROP TABLE IF EXISTS `contactpoint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contactpoint` (
  `contactPoint_id` int NOT NULL AUTO_INCREMENT,
  `journeyMap_id` int DEFAULT NULL,
  `linePos` int DEFAULT NULL,
  `posX` int DEFAULT NULL,
  `length` int DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `emojiTag` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`contactPoint_id`),
  KEY `journeyMap_id` (`journeyMap_id`),
  CONSTRAINT `contactpoint_ibfk_1` FOREIGN KEY (`journeyMap_id`) REFERENCES `journeymap` (`journeyMap_id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactpoint`
--

LOCK TABLES `contactpoint` WRITE;
/*!40000 ALTER TABLE `contactpoint` DISABLE KEYS */;
INSERT INTO `contactpoint` VALUES (66,3,285,20,230,'esse é um ponto de contato ','emoji triste'),(79,34,285,20,230,'','Novo emoji'),(80,8,285,20,230,'esse é um ponto de contato ','emoji triste'),(81,42,285,20,230,'esse é um ponto de contato ','emoji triste'),(83,57,285,20,230,'esse é um ponto de contato ','emoji triste');
/*!40000 ALTER TABLE `contactpoint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emotion`
--

DROP TABLE IF EXISTS `emotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emotion` (
  `emotion_id` int NOT NULL AUTO_INCREMENT,
  `journeyMap_id` int DEFAULT NULL,
  `posX` int DEFAULT NULL,
  `lineY` int DEFAULT NULL,
  `emojiTag` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`emotion_id`),
  KEY `journeyMap_id` (`journeyMap_id`),
  CONSTRAINT `emotion_ibfk_1` FOREIGN KEY (`journeyMap_id`) REFERENCES `journeymap` (`journeyMap_id`)
) ENGINE=InnoDB AUTO_INCREMENT=212 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emotion`
--

LOCK TABLES `emotion` WRITE;
/*!40000 ALTER TABLE `emotion` DISABLE KEYS */;
INSERT INTO `emotion` VALUES (182,3,20,-10,'?'),(205,34,830,-15,'?'),(207,8,20,-15,'?'),(208,42,20,0,'?'),(210,8,560,35,'?'),(211,57,20,0,'?');
/*!40000 ALTER TABLE `emotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journeymap`
--

DROP TABLE IF EXISTS `journeymap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journeymap` (
  `journeyMap_id` int NOT NULL AUTO_INCREMENT,
  `map_name` varchar(45) DEFAULT NULL,
  `user_id` varchar(256) NOT NULL,
  PRIMARY KEY (`journeyMap_id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journeymap`
--

LOCK TABLES `journeymap` WRITE;
/*!40000 ALTER TABLE `journeymap` DISABLE KEYS */;
INSERT INTO `journeymap` VALUES (3,'Mapa 1','dcYhGgvKAoP91IFfAtQRJWryB4J2'),(4,'teste 5','dcYhGgvKAoP91IFfAtQRJWryB4J2'),(5,'aaaaaaa','dcYhGgvKAoP91IFfAtQRJWryB4J2'),(8,'teste gui','hKEeVlMbyLV3wxy2mgWNksYvzIc2'),(9,'este 2','hKEeVlMbyLV3wxy2mgWNksYvzIc2'),(10,'teste 3','hKEeVlMbyLV3wxy2mgWNksYvzIc2'),(11,'teste 5','hKEeVlMbyLV3wxy2mgWNksYvzIc2'),(12,'teste 6','hKEeVlMbyLV3wxy2mgWNksYvzIc2'),(34,'teste','dcYhGgvKAoP91IFfAtQRJWryB4J2'),(42,'a','fDqye2D2J5gJHA0IF4Z8Yy3szF23'),(56,'ste','hKEeVlMbyLV3wxy2mgWNksYvzIc2'),(57,'ste','o0A9IBiMZEbemv5MIYgyzw5itSu2'),(58,'teste 9','dcYhGgvKAoP91IFfAtQRJWryB4J2'),(67,'2','dcYhGgvKAoP91IFfAtQRJWryB4J2'),(68,'e2','dcYhGgvKAoP91IFfAtQRJWryB4J2'),(69,'e3','dcYhGgvKAoP91IFfAtQRJWryB4J2'),(70,'e34','dcYhGgvKAoP91IFfAtQRJWryB4J2'),(71,'3','dcYhGgvKAoP91IFfAtQRJWryB4J2'),(72,'2','dcYhGgvKAoP91IFfAtQRJWryB4J2'),(73,'aq','dcYhGgvKAoP91IFfAtQRJWryB4J2');
/*!40000 ALTER TABLE `journeymap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journeyphase`
--

DROP TABLE IF EXISTS `journeyphase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journeyphase` (
  `journeyPhase_id` int NOT NULL AUTO_INCREMENT,
  `journeyMap_id` int DEFAULT NULL,
  `linePos` int DEFAULT NULL,
  `posX` int DEFAULT NULL,
  `length` int DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `emojiTag` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`journeyPhase_id`),
  KEY `journeyMap_id` (`journeyMap_id`),
  CONSTRAINT `journeyphase_ibfk_1` FOREIGN KEY (`journeyMap_id`) REFERENCES `journeymap` (`journeyMap_id`)
) ENGINE=InnoDB AUTO_INCREMENT=184 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journeyphase`
--

LOCK TABLES `journeyphase` WRITE;
/*!40000 ALTER TABLE `journeyphase` DISABLE KEYS */;
INSERT INTO `journeyphase` VALUES (163,3,285,20,230,'essa é uma fase de jornada','emoji feliz'),(179,34,285,20,230,'essa é uma fase de jornada','emoji feliz'),(180,8,285,20,1040,'comprar celular','emoji feliz'),(181,42,285,20,230,'essa é uma fase de jornada','emoji feliz'),(183,57,285,20,230,'essa é uma fase de jornada','emoji feliz');
/*!40000 ALTER TABLE `journeyphase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `map`
--

DROP TABLE IF EXISTS `map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `map` (
  `map_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`map_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `map`
--

LOCK TABLES `map` WRITE;
/*!40000 ALTER TABLE `map` DISABLE KEYS */;
INSERT INTO `map` VALUES (1);
/*!40000 ALTER TABLE `map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `persona_id` int NOT NULL AUTO_INCREMENT,
  `scenario_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `information` text,
  `goals` text,
  `behavior` text,
  PRIMARY KEY (`persona_id`),
  KEY `scenario_id` (`scenario_id`),
  CONSTRAINT `persona_ibfk_1` FOREIGN KEY (`scenario_id`) REFERENCES `scenario` (`scenario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scenario`
--

DROP TABLE IF EXISTS `scenario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scenario` (
  `scenario_id` int NOT NULL AUTO_INCREMENT,
  `journeyMap_id` int DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`scenario_id`),
  KEY `journeyMap_id` (`journeyMap_id`),
  CONSTRAINT `scenario_ibfk_1` FOREIGN KEY (`journeyMap_id`) REFERENCES `journeymap` (`journeyMap_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scenario`
--

LOCK TABLES `scenario` WRITE;
/*!40000 ALTER TABLE `scenario` DISABLE KEYS */;
INSERT INTO `scenario` VALUES (1,3,'vai comprar um telemovel','compra celular'),(3,34,'','');
/*!40000 ALTER TABLE `scenario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thought`
--

DROP TABLE IF EXISTS `thought`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thought` (
  `thought_id` int NOT NULL AUTO_INCREMENT,
  `journeyMap_id` int DEFAULT NULL,
  `linePos` int DEFAULT NULL,
  `posX` int DEFAULT NULL,
  `length` int DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `emojiTag` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`thought_id`),
  KEY `journeyMap_id` (`journeyMap_id`),
  CONSTRAINT `thought_ibfk_1` FOREIGN KEY (`journeyMap_id`) REFERENCES `journeymap` (`journeyMap_id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thought`
--

LOCK TABLES `thought` WRITE;
/*!40000 ALTER TABLE `thought` DISABLE KEYS */;
INSERT INTO `thought` VALUES (48,3,285,20,230,'esse é um thought','emoji pensando'),(61,34,285,20,230,'','Novo emoji'),(62,8,285,290,230,'\"esse é um pensamento\"','emoji pensando'),(63,42,285,20,230,'esse é um pensamento','emoji pensando'),(66,57,285,20,230,'esse é um pensamento','emoji pensando');
/*!40000 ALTER TABLE `thought` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `useraction`
--

DROP TABLE IF EXISTS `useraction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `useraction` (
  `userAction_id` int NOT NULL AUTO_INCREMENT,
  `journeyMap_id` int DEFAULT NULL,
  `linePos` int DEFAULT NULL,
  `posX` int DEFAULT NULL,
  `length` int DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `emojiTag` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userAction_id`),
  KEY `journeyMap_id` (`journeyMap_id`),
  CONSTRAINT `useraction_ibfk_1` FOREIGN KEY (`journeyMap_id`) REFERENCES `journeymap` (`journeyMap_id`)
) ENGINE=InnoDB AUTO_INCREMENT=323 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useraction`
--

LOCK TABLES `useraction` WRITE;
/*!40000 ALTER TABLE `useraction` DISABLE KEYS */;
INSERT INTO `useraction` VALUES (273,3,285,20,230,'essa é uma ação do usuario','emoji feliz'),(315,34,285,20,230,'','Novo emoji'),(318,8,285,20,230,'teste','Novo emoji'),(319,42,285,20,230,'essa é uma ação do usuario','emoji feliz'),(321,57,285,20,230,'essa é uma ação do usuario','emoji feliz');
/*!40000 ALTER TABLE `useraction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `idusers` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `password` varchar(200) NOT NULL,
  PRIMARY KEY (`idusers`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-27 10:18:00
