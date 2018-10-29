-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 12, 2018 at 04:34 PM
-- Server version: 5.7.14
-- PHP Version: 7.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pharmacy`
--

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `company_id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_discription` varchar(1000) DEFAULT NULL,
  `company_logo` varchar(255) DEFAULT NULL,
  `company_email` varchar(255) NOT NULL,
  `company_contact_no` varchar(255) NOT NULL,
  `company_address` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`company_id`, `company_name`, `company_discription`, `company_logo`, `company_email`, `company_contact_no`, `company_address`) VALUES
(13, 'CIC Holding PLC', 'Chemical Industries (Colombo) Limited (initially a part of Imperial Chemical Industries-UK), was incorporated in 1964 as a supplier of high-quality chemical products for the local market. We are now known as CIC Holdings PLC, one of Sri Lanka’s leading conglomerates, and over the years have become a household name through our many ventures.', '../upload/myImage_1521439367594_Discre.jpg', 'amilawicramarathna95@gmail.comq', '0754898974', 'COLOMBO 02'),
(14, 'Hemas Holding PLC', 'In our continuous endeavor to make a positive difference in lifestyles, we at Hemas strongly believe that we’ve contributed to defining ‘comfort’, ‘satisfaction’, ‘innovation’ and ‘safety’ in the countries we serve in. Our strength, our values and our determination, will be passed down generations, embracing opportunities, ensuring that Hemas continues to enrich lives. \r\n', '../upload/myImage_1521942811696_HemasHoldingsLogo2-1.jpeg', 'Hemas@gmail.com', '0117 888 888', '647/2A Pannipitiya Rd, Thalawathugoda '),
(12, 'Emercheime NB(Ceylon)Plc', 'True to our vision we foster the cause of Medicine and Mankind by sourcing high quality pharmaceuticals conforming to international standards. We endeavour to maintain a professional corporate environment promoting unity in diversity. At Emerchemie NB, minds meet, creativity flourishes and fellowship thrives. We are very much aware of our responsibility to the population we serve and believe that the mission should start within the portals of our Offices.', '../upload/sss.png', 'ehbde@bhbd', '028626', '20ndbdhdhd '),
(15, 'Brandix', 'cgdg', '../upload/myImage_1534945336929_Frontimage.jpg', 'Brad@gmail.com', '0750504648', 'Colombo 10');

-- --------------------------------------------------------

--
-- Table structure for table `discuss`
--

CREATE TABLE `discuss` (
  `dis_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `details` varchar(600) DEFAULT NULL,
  `view` tinyint(4) NOT NULL DEFAULT '0',
  `Reply` varchar(600) DEFAULT NULL,
  `sent_date` varchar(255) NOT NULL,
  `reply_seen` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `discuss`
--

INSERT INTO `discuss` (`dis_id`, `user_id`, `type`, `subject`, `details`, `view`, `Reply`, `sent_date`, `reply_seen`) VALUES
(1, 10, 'Complain', 'Order', ' miss items', 1, '\r\ndyudfd', '', 0),
(2, 9, 'Suggestion', 'Payment', ' fujnvigovmh', 1, NULL, '', 0),
(3, 10, 'other', 'gh', '  bn n', 1, NULL, '', 0),
(4, 8, 'other', 'aaa', ' vvvvv', 1, NULL, '', 0),
(5, 9, 'Complain', 'Orders Not came on Date', ' I order in 201/05/14 in order Id 25 in order.but nit approval yet', 1, NULL, '2018-05-27', 0),
(6, 8, 'Complain', 'hi', ' u8okp', 1, '\r\ngyuhijh', '2018-06-12', 0),
(7, 8, 'Complain', 'order not came', ' in oder no 78 not coming yet', 1, NULL, '2018-06-19', 0),
(8, 8, 'Suggestion', 'new product', ' agburn want', 1, NULL, '2018-06-19', 0),
(9, 8, 'other', 'ggggggggggg', ' gghyuuhh', 1, NULL, '2018-06-19', 0),
(10, 8, 'Suggestion', 'ddddd', ' fgdggg', 0, '\r\navvdbufgs', '2018-06-20', 0),
(13, 12, 'Complain', 'About Delivery', ' my order was delay 2 days', 0, '\r\nokay i check it and inform you', '2018-08-20', 0),
(14, 11, 'Complain', 'delivery time', ' late deliveries', 0, 'i note that\r\n', '2018-08-22', 0),
(15, 12, NULL, '', ' ', 0, NULL, '2018-08-22', 0),
(16, 12, 'Complain', 'delivey', ' late', 0, NULL, '2018-08-23', 0);

-- --------------------------------------------------------

--
-- Table structure for table `oderlist`
--

CREATE TABLE `oderlist` (
  `oder_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `units` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `batch_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `oderlist`
--

INSERT INTO `oderlist` (`oder_id`, `item_id`, `units`, `item_name`, `price`, `batch_id`) VALUES
(4, 1, 8, '', 0, NULL),
(4, 1, 8, '', 0, NULL),
(4, 1, 8, '', 0, NULL),
(4, 1, 8, '', 0, NULL),
(4, 1, 8, '', 0, NULL),
(4, 1, 8, '', 0, NULL),
(4, 1, 8, '', 0, NULL),
(4, 1, 8, '', 0, NULL),
(4, 1, 8, '', 0, NULL),
(4, 3, 8, 'pereten', 10, NULL),
(2, 1, 8, 'pandole', 5, NULL),
(2, 3, 8, 'pereten', 10, NULL),
(5, 1, 8, 'pandole', 5, NULL),
(5, 3, 8, 'pereten', 10, NULL),
(6, 1, 8, 'pandole', 5, NULL),
(6, 1, 8, 'pandole', 5, NULL),
(7, 3, 8, 'pereten', 10, NULL),
(7, 3, 8, 'pereten', 10, NULL),
(8, 3, 5, 'pereten', 10, NULL),
(9, 3, 25, 'pereten', 250, NULL),
(9, 1, 10, 'pandole', 5, NULL),
(10, 1, 20, 'pandole', 100, NULL),
(11, 1, 5, 'pandole', 25, NULL),
(11, 2, 50, 'bhscc', 250, NULL),
(11, 2, 5, 'bhscc', 25, NULL),
(11, 2, 5, 'bhscc', 25, NULL),
(11, 2, 20, 'bhscc', 100, NULL),
(11, 2, 8, 'bhscc', 40, NULL),
(12, 2, 10, 'bhscc', 50, NULL),
(10, 2, 5, 'bhscc', 25, NULL),
(11, 2, 10, 'bhscc', 50, NULL),
(12, 2, 20, 'bhscc', 100, NULL),
(13, 2, 8, 'bhscc', 40, NULL),
(13, 2, 10, 'bhscc', 50, NULL),
(14, 2, 50, 'bhscc', 250, NULL),
(15, 2, 5, 'bhscc', 25, NULL),
(16, 2, 100, 'bhscc', 500, NULL),
(17, 2, 10, 'bhscc', 50, NULL),
(18, 2, 100, 'bhscc', 500, NULL),
(19, 2, 10, 'bhscc', 50, NULL),
(20, 2, 10, 'bhscc', 50, NULL),
(21, 2, 50, 'bhscc', 250, NULL),
(22, 2, 15, 'bhscc', 75, NULL),
(23, 2, 25, 'bhscc', 125, NULL),
(24, 2, 5, 'bhscc', 25, NULL),
(25, 2, 10, 'bhscc', 50, NULL),
(26, 4, 5, 'penadol new', 125, NULL),
(26, 6, 8, 'Corex D', 800, NULL),
(26, 8, 8, 'Vitamin C', 80, NULL),
(27, 10, 10, 'Augmenting', 1200, NULL),
(28, 4, 8, 'Penadol', 200, NULL),
(28, 10, 8, 'Augmenting', 960, NULL),
(33, 10, 2, 'Augmenting', 240, NULL),
(34, 4, 10, 'Penadol', 250, NULL),
(34, 10, 3, 'Augmenting', 360, NULL),
(35, 6, 3, 'Corex D', 300, NULL),
(36, 8, 5, 'Vitamin C', 50, NULL),
(36, 9, 2, 'Vitamin E', 20, NULL),
(37, 9, 5, 'Vitamin E', 50, NULL),
(38, 10, 3, 'Augmenting', 360, NULL),
(38, 8, 4, 'Vitamin C', 40, NULL),
(39, 10, 8, 'Augmenting', 960, NULL),
(39, 6, 10, 'Corex D', 1000, NULL),
(40, 10, 10, 'Augmenting', 1200, NULL),
(40, 9, 10, 'Vitamin E', 100, NULL),
(40, 7, 10, 'Piritan', 100, NULL),
(41, 4, 8, 'Penadol', 200, NULL),
(41, 10, 10, 'Augmenting', 1200, NULL),
(41, 9, 8, 'Vitamin E', 80, NULL),
(42, 6, 10, 'Corex D', 1000, NULL),
(42, 10, 8, 'Augmenting', 960, NULL),
(43, 10, 10, 'Augmenting', 1200, NULL),
(43, 4, 10, 'Penadol', 250, NULL),
(43, 9, 10, 'Vitamin E', 100, NULL),
(44, 9, 10, 'Vitamin E', 100, NULL),
(44, 10, 40, 'Augmenting', 4800, NULL),
(45, 4, 10, 'Penadol', 250, NULL),
(45, 7, 10, 'Piritan', 100, NULL),
(46, 8, 10, 'Vitamin C', 100, NULL),
(46, 10, 10, 'Augmenting', 1200, NULL),
(47, 7, 10, 'Piritan', 100, NULL),
(47, 9, 10, 'Vitamin E', 100, NULL),
(48, 7, 10, 'Piritan', 100, NULL),
(48, 9, 10, 'Vitamin E', 100, NULL),
(49, 4, 10, 'Penadol', 250, NULL),
(49, 7, 10, 'Piritan', 100, NULL),
(49, 8, 10, 'Vitamin C', 100, NULL),
(50, 4, 10, 'Penadol', 250, NULL),
(50, 6, 10, 'Corex D', 1000, NULL),
(51, 6, 10, 'Corex D', 1000, NULL),
(51, 4, 10, 'Penadol', 250, NULL),
(52, 9, 10, 'Vitamin E', 100, NULL),
(52, 10, 10, 'Augmenting', 1200, NULL),
(53, 4, 5, 'Penadol', 125, NULL),
(53, 7, 10, 'Piritan', 100, NULL),
(53, 8, 15, 'Vitamin C', 150, NULL),
(54, 7, 10, 'Piritan', 100, NULL),
(54, 6, 10, 'Corex D', 1000, NULL),
(55, 10, 10, 'Augmenting', 1200, NULL),
(55, 9, 10, 'Vitamin E', 100, NULL),
(56, 10, 10, 'Augmenting', 1200, NULL),
(56, 9, 5, 'Vitamin E', 50, NULL),
(56, 6, 20, 'Corex D', 2000, NULL),
(57, 7, 10, 'Piritan', 100, NULL),
(57, 10, 50, 'Augmenting', 6000, NULL),
(57, 9, 20, 'Vitamin E', 200, NULL),
(58, 10, 10, 'Augmenting', 1200, NULL),
(58, 9, 10, 'Vitamin E', 100, NULL),
(58, 6, 5, 'Corex D', 500, NULL),
(59, 10, 10, 'Augmenting', 1200, NULL),
(59, 9, 10, 'Vitamin E', 100, NULL),
(60, 6, 10, 'Corex D', 1000, NULL),
(60, 10, 10, 'Augmenting', 1200, NULL),
(60, 8, 10, 'Vitamin C', 100, NULL),
(61, 4, 5, 'Penadol', 125, NULL),
(61, 10, 15, 'Augmenting', 1800, NULL),
(61, 9, 20, 'Vitamin E', 200, NULL),
(62, 8, 15, 'Vitamin C', 150, NULL),
(62, 6, 10, 'Corex D', 1000, NULL),
(62, 4, 20, 'Penadol', 500, NULL),
(63, 8, 10, 'Vitamin C', 100, NULL),
(63, 10, 20, 'Augmenting', 2400, NULL),
(63, 6, 25, 'Corex D', 2500, NULL),
(64, 4, 25, 'Penadol', 625, NULL),
(64, 10, 10, 'Augmenting', 1200, NULL),
(64, 7, 15, 'Piritan', 150, NULL),
(64, 8, 8, 'Vitamin C', 80, NULL),
(64, 6, 10, 'Corex D', 1000, NULL),
(64, 9, 15, 'Vitamin E', 150, NULL),
(65, 4, 10, 'Penadol', 250, NULL),
(65, 7, 10, 'Piritan', 100, NULL),
(65, 8, 10, 'Vitamin C', 100, NULL),
(66, 6, 5, 'Corex D', 500, NULL),
(66, 9, 3, 'Vitamin E', 30, NULL),
(66, 10, 5, 'Augmenting', 600, NULL),
(68, 4, 2, 'Penadol', 700, NULL),
(67, 7, 30, 'Piritan', 300, NULL),
(68, 10, 10, 'Augmenting', 14400, NULL),
(69, 8, 120, 'Vitamin C', 1200, NULL),
(69, 4, 25, 'Penadol', 625, NULL),
(69, 10, 10, 'Augmenting', 1200, NULL),
(70, 8, 22, 'Vitamin C', 220, NULL),
(70, 4, 2, 'Penadol', 50, NULL),
(71, 8, 15, 'Vitamin C', 150, NULL),
(94, 6, 30, 'CorexD', 3000, NULL),
(94, 10, 10, 'Augmenting', 1200, NULL),
(94, 11, 20, 'amociline', 2500, NULL),
(94, 7, 10, 'Piritan', 100, NULL),
(93, 10, 10, 'Augmenting', 1200, NULL),
(75, 10, 5, 'Augmenting', 600, NULL),
(75, 9, 3, 'Vitamin E', 30, NULL),
(76, 7, 20, 'Piritan', 200, NULL),
(76, 6, 20, 'CorexD', 2000, NULL),
(77, 7, 30, 'Piritan', 300, NULL),
(77, 6, 20, 'CorexD', 2000, NULL),
(77, 10, 20, 'Augmenting', 2400, NULL),
(78, 8, 5, 'Vitamin C', 50, NULL),
(78, 4, 20, 'Penadol', 500, NULL),
(78, 10, 20, 'Augmenting', 2400, NULL),
(78, 9, 20, 'Vitamin E', 200, NULL),
(79, 8, 5, 'Vitamin C', 50, NULL),
(80, 4, 50, 'Penadol', 1250, NULL),
(80, 9, 20, 'Vitamin E', 200, NULL),
(81, 7, 25, 'Piritan', 250, NULL),
(82, 9, 20, 'Vitamin E', 200, NULL),
(82, 8, 5, 'Vitamin C', 50, NULL),
(83, 10, 10, 'Augmenting', 1200, NULL),
(83, 6, 10, 'CorexD', 1000, NULL),
(84, 13, 20, 'ADPROPS EYE DROPS 3ML', 3000, NULL),
(84, 9, 20, 'Vitamin E', 200, NULL),
(85, 12, 30, 'AB Dentalac Table 3*10s', 80100, NULL),
(85, 4, 10, 'Penadol', 250, NULL),
(86, 12, 5, 'AB Dentalac Table 3*10s', 13350, NULL),
(86, 10, 5, 'Augmenting', 600, NULL),
(87, 12, 5, 'AB Dentalac Table 3*10s', 13350, NULL),
(87, 4, 5, 'Penadol', 125, NULL),
(87, 13, 5, 'ADPROPS EYE DROPS 3ML', 750, NULL),
(87, 11, 5, 'amociline', 625, NULL),
(88, 13, 5, 'ADPROPS EYE DROPS 3ML', 750, NULL),
(88, 12, 5, 'AB Dentalac Table 3*10s', 13350, NULL),
(88, 9, 10, 'Vitamin E', 100, NULL),
(88, 4, 15, 'Penadol', 375, NULL),
(88, 11, 10, 'amociline', 1250, NULL),
(88, 8, 10, 'Vitamin C', 100, NULL),
(89, 4, 90, 'Penadol', 2250, NULL),
(89, 8, 15, 'Vitamin C', 150, NULL),
(89, 12, 5, 'AB Dentalac Table 3*10s', 13350, NULL),
(89, 11, 10, 'amociline', 1250, NULL),
(89, 13, 55, 'ADPROPS EYE DROPS 3ML', 8250, NULL),
(89, 7, 10, 'Piritan', 100, NULL),
(90, 4, 30, 'Penadol', 750, NULL),
(90, 12, 10, 'AB Dentalac Table 3*10s', 26700, NULL),
(90, 8, 10, 'Vitamin C', 100, NULL),
(91, 4, 15, 'Penadol', 375, NULL),
(91, 7, 10, 'Piritan', 100, NULL),
(91, 10, 25, 'Augmenting', 3000, NULL),
(91, 6, 5, 'CorexD', 500, NULL),
(91, 12, 10, 'AB Dentalac Table 3*10s', 26700, NULL),
(92, 12, 30, 'AB Dentalac Table 3*10s', 80100, NULL),
(92, 13, 10, 'ADPROPS EYE DROPS 3ML', 1500, NULL),
(92, 10, 20, 'Augmenting', 2400, NULL),
(92, 7, 5, 'Piritan', 50, NULL),
(92, 11, 110, 'amociline', 13750, NULL),
(93, 4, 10, 'Penadol', 250, NULL),
(93, 4, 10, 'Penadol', 250, NULL),
(93, 10, 20, 'Augmenting', 2400, NULL),
(94, 8, 5, 'Vitamin C', 50, NULL),
(94, 12, 20, 'AB Dentalac Table 3*10s', 53400, NULL),
(94, 4, 20, 'Penadol', 500, NULL),
(95, 8, 10, 'Vitamin C', 100, NULL),
(95, 12, 40, 'AB Dentalac Table 3*10s', 106800, NULL),
(95, 13, 10, 'ADPROPS EYE DROPS 3ML', 1500, NULL),
(95, 7, 5, 'Piritan', 50, NULL),
(95, 11, 10, 'amociline', 1250, NULL),
(95, 10, 15, 'Augmenting', 1800, NULL),
(96, 7, 10, 'Piritan', 100, NULL),
(96, 4, 10, 'Penadol', 250, NULL),
(97, 7, 10, 'Piritan', 100, NULL),
(97, 4, 10, 'Penadol', 250, NULL),
(98, 4, 45, 'Penadol', 1125, NULL),
(98, 9, 10, 'Vitamin E', 100, NULL),
(98, 8, 10, 'Vitamin C', 100, NULL),
(99, 8, 5, 'Vitamin C', 50, NULL),
(101, 4, 45, 'Penadol', 1125, NULL),
(101, 7, 10, 'Piritan', 100, NULL),
(100, 4, 15, 'Penadol', 375, NULL),
(101, 8, 10, 'Vitamin C', 100, NULL),
(103, 4, 10, 'Penadol', 250, NULL),
(104, 4, 100, 'Penadol', 2500, 2),
(104, 7, 100, 'Piritan', 1000, 4),
(105, 7, 80, 'Piritan', 800, 4),
(105, 4, 10, 'Penadol', 250, 5),
(106, 7, 50, 'Piritan', 500, 8),
(106, 7, 10, 'Piritan', 100, NULL),
(106, 4, 70, 'Penadol', 1750, 5),
(106, 4, 10, 'Penadol', 250, 10),
(107, 4, 40, 'Penadol', 1000, 11),
(107, 4, 10, 'Penadol', 250, 10),
(108, 9, 50, 'Vitamin E', 500, 12),
(108, 9, 20, 'Vitamin E', 200, 13),
(110, 4, 20, 'Penadol', 500, 15),
(109, 4, 20, 'Penadol', 500, 14),
(110, 7, 80, 'Piritan', 800, 9),
(111, 7, 30, 'Piritan', 300, 18),
(111, 7, 50, 'Piritan', 500, 17),
(112, 7, 60, 'Piritan', 600, 17),
(113, 7, 50, 'Piritan', 500, 17),
(113, 7, 30, 'Piritan', 300, 18),
(114, 7, 130, 'Piritan', 1300, 17),
(114, 7, 30, 'Piritan', 300, 18),
(115, 7, 10, 'Piritan', 100, 18),
(115, 6, 10, 'CorexD', 1000, 7),
(116, 4, 10, 'Penadol', 250, 16),
(116, 6, 20, 'CorexD', 2000, 7),
(116, 9, 10, 'Vitamin E', 100, 13),
(117, 4, 20, 'Panadol', 500, 16),
(118, 4, 20, 'BETASERC 16MG TABS', 500, 16),
(118, 12, 100, 'AB Dentalac Table 3*10s', 267000, 21),
(118, 12, 20, 'AB Dentalac Table 3*10s', 53400, 29),
(119, 12, 50, 'AB Dentalac Table 3*10s', 133500, 30),
(119, 12, 10, 'AB Dentalac Table 3*10s', 26700, 29),
(119, 18, 20, 'CCL ACASIA 250MG CAPSULES', 3000, 20),
(119, 17, 30, 'PHAMEVO-ORSLIM 120MG', 1500, 24),
(119, 19, 10, 'CCL ORINAC 1MG TABS', 2500, 26),
(120, 17, 20, 'PHAMEVO-ORSLIM 120MG', 1000, 24),
(120, 19, 10, 'CCL ORINAC 1MG TABS', 2500, 26),
(121, 12, 10, 'AB Dentalac Table 3*10s', 26700, 31),
(121, 13, 60, 'ADPROPS EYE DROPS 3ML', 9000, 22),
(122, 12, 10, 'AB Dentalac Table 3*10s', 26700, 31),
(122, 18, 10, 'CCL ACASIA 250MG CAPSULES', 1500, 20),
(122, 20, 8, 'BETASERC', 200, 27),
(122, 21, 8, 'AI - EPILEX CHRONO 500MG   ', 320, 28),
(124, 12, 5, 'AI - EPILEX CHRONO 500MG   ', 13350, 29),
(124, 12, 5, 'AI - EPILEX CHRONO 500MG   ', 13350, 31),
(123, 12, 10, 'AI - EPILEX CHRONO 500MG   ', 26700, 31),
(123, 13, 10, 'ADPROPS', 1500, 22),
(124, 15, 10, 'BETASERC 24 MG TABS', 250, 23),
(124, 16, 5, 'DUPHAL,AC SYRUP 200ML', 1750, 25),
(124, 18, 10, 'CCL ACASIA 250MG CAPSULES', 1500, 20),
(125, 4, 10, 'BETASERC', 250, 32),
(125, 18, 10, 'CCL ACASIA 250MG CAPSULES', 1500, 20),
(126, 4, 40, 'BETASERC', 1000, 32),
(126, 16, 60, 'DUPHAL,AC SYRUP 200ML', 21000, 25),
(127, 21, 20, 'AI - EPILEX CHRONO 500MG   ', 800, 28),
(127, 16, 10, 'DUPHAL,AC SYRUP 200ML', 3500, 25),
(128, 12, 0, 'AI - EPILEX CHRONO 500MG   ', 0, 31),
(128, 12, 0, 'AI - EPILEX CHRONO 500MG   ', 0, 31),
(129, 4, 10, 'BETASERC', 250, 32),
(129, 16, 10, 'DUPHAL,AC SYRUP 200ML', 3500, 25),
(129, 18, 10, 'CCL ACASIA 250MG CAPSULES', 1500, 20),
(130, 4, 10, 'BETASERC', 250, 32),
(131, 4, 10, 'BETASERC', 250, 32),
(131, 12, 10, 'AI - EPILEX CHRONO 500MG   ', 26700, 29);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `approval` tinyint(4) NOT NULL DEFAULT '0',
  `order_date` varchar(255) NOT NULL,
  `approval_date` varchar(255) DEFAULT NULL,
  `deliver_date` varchar(255) DEFAULT NULL,
  `qrimage` varchar(255) DEFAULT NULL,
  `invoice` varchar(255) DEFAULT NULL,
  `discount` int(11) DEFAULT NULL,
  `seen` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`user_id`, `order_id`, `approval`, `order_date`, `approval_date`, `deliver_date`, `qrimage`, `invoice`, `discount`, `seen`) VALUES
(8, 73, 1, '2018-04-12', '2018-04-12', '2018-04-12', NULL, NULL, 0, 1),
(9, 74, 1, '2018-04-12', '2018-04-12', '2018-04-13', '../upload/74MyQRCODE1.png', NULL, 0, 1),
(9, 75, 1, '2018-04-12', '2018-04-18', '2018-04-18', '../upload/75MyQRCODE1.png', NULL, 0, 0),
(8, 76, 1, '2018-04-13', '2018-04-13', '2018-04-13', '../upload/76MyQRCODE1.png', NULL, 0, 1),
(10, 77, 1, '2018-04-14', '2018-04-14', '2018-04-14', '../upload/77MyQRCODE1.png', NULL, 0, 1),
(8, 78, 1, '2018-04-15', '2018-04-15', '2018-04-15', '../upload/78MyQRCODE1.png', NULL, 0, 1),
(8, 79, 1, '2018-04-17', '2018-04-17', '2018-04-17', '../upload/79MyQRCODE1.png', NULL, 0, 1),
(8, 80, 1, '2018-04-19', '2018-04-19', '2018-04-19', '../upload/80MyQRCODE1.png', NULL, 0, 1),
(12, 81, 1, '2018-04-23', '2018-04-23', '2018-04-23', '../upload/81MyQRCODE1.png', NULL, 0, 1),
(8, 82, 1, '2018-04-23', '2018-04-24', '2018-04-24', '../upload/82MyQRCODE1.png', NULL, 0, 1),
(12, 83, 1, '2018-04-24', '2018-05-09', '2018-05-25', '../upload/83MyQRCODE1.png', NULL, 0, 1),
(8, 84, 1, '2018-05-02', '2018-05-08', '2018-05-31', '../upload/84MyQRCODE1.png', '../upload/myImage_1525758148084_AdminLTE 2 _ Collapsed Sidebar Layout33.pdf84', 0, 1),
(8, 85, 1, '2018-05-02', '2018-05-08', '2018-05-31', '../upload/85MyQRCODE1.png', '../upload/myImage_1525765795383_AdminLTE 2 _ Collapsed Sidebarfir.pdf', 0, 1),
(10, 86, 1, '2018-05-03', '2018-05-08', '2018-05-30', '../upload/86MyQRCODE1.png', '../upload/myImage_1525756970508_AdminLTE 2 _ Collapsed Sidebar Layout.pdf', 0, 0),
(10, 87, 1, '2018-05-03', '2018-05-08', '2018-05-31', '../upload/87MyQRCODE1.png', '../upload/myImage_1525758102807_AdminLTE 2 _ Collapsed Sidebar Layout1.pdf87', 0, 0),
(8, 88, 1, '2018-05-03', '2018-05-08', '2018-05-30', '../upload/88MyQRCODE1.png', '../upload/myImage_1525766239391_add.pdf', 0, 1),
(8, 89, 1, '2018-05-09', '2018-06-19', '', '../upload/89MyQRCODE1.png', NULL, 5, 1),
(8, 90, 1, '2018-05-09', '2018-06-19', '', '../upload/90MyQRCODE1.png', NULL, 5, 1),
(8, 91, 1, '2018-05-13', '2018-06-19', '2018-06-20', '../upload/91MyQRCODE1.png', NULL, 5, 1),
(8, 92, 1, '2018-05-13', '2018-06-19', '2018-06-20', '../upload/92MyQRCODE1.png', NULL, 5, 1),
(8, 93, 1, '2018-05-13', '2018-06-19', '2018-06-19', '../upload/93MyQRCODE1.png', NULL, 5, 1),
(8, 94, 1, '2018-05-13', '2018-06-19', '2018-06-18', '../upload/94MyQRCODE1.png', NULL, 5, 0),
(8, 95, 1, '2018-05-14', '2018-06-19', '2018-06-17', '../upload/95MyQRCODE1.png', NULL, 5, 1),
(8, 96, 1, '2018-05-15', '2018-06-19', '2018-06-18', '../upload/96MyQRCODE1.png', NULL, 5, 1),
(10, 97, 1, '2018-05-15', '2018-06-19', '', '../upload/97MyQRCODE1.png', '../upload/myImage_1529355484815_Pharmaceutical Distribution System.pdf', 5, 0),
(12, 98, 1, '2018-05-18', '2018-08-17', '2018-08-17', '../upload/98MyQRCODE1.png', NULL, 5, 1),
(12, 99, 1, '2018-05-18', '2018-08-19', '2018-08-19', '../upload/99MyQRCODE1.png', NULL, 5, 1),
(8, 100, 1, '2018-05-21', '2018-05-24', '2018-05-26', '../upload/100MyQRCODE1.png', '../upload/myImage_1527149354042_abc.pdf', 5, 1),
(12, 101, 1, '2018-05-21', '2018-05-26', '2018-08-30', '../upload/101MyQRCODE1.png', NULL, 5, 1),
(12, 102, 1, '2018-05-21', '2018-08-22', '2018-08-22', '../upload/102MyQRCODE1.png', NULL, 5, 1),
(10, 103, 1, '2018-05-22', '2018-08-22', '2018-08-15', '../upload/103MyQRCODE1.png', NULL, 5, 0),
(8, 104, 1, '2018-05-24', '2018-05-24', '', '../upload/104MyQRCODE1.png', NULL, 5, 1),
(8, 105, 1, '2018-05-24', '2018-06-19', '2018-06-18', '../upload/105MyQRCODE1.png', NULL, 5, 0),
(8, 106, 1, '2018-05-24', '2018-06-19', '2018-06-20', '../upload/106MyQRCODE1.png', NULL, 5, 0),
(9, 107, 1, '2018-05-24', '2018-08-19', '2018-08-19', '../upload/107MyQRCODE1.png', NULL, 5, 0),
(9, 108, 1, '2018-05-24', '2018-08-19', '2018-08-19', '../upload/108MyQRCODE1.png', NULL, 0, 0),
(9, 109, 0, '2018-05-25', NULL, NULL, NULL, NULL, NULL, 0),
(9, 110, 0, '2018-05-25', NULL, NULL, NULL, NULL, NULL, 0),
(9, 111, 0, '2018-05-25', NULL, NULL, NULL, NULL, NULL, 0),
(9, 112, 0, '2018-05-25', NULL, NULL, NULL, NULL, NULL, 0),
(9, 113, 1, '2018-05-25', '2018-06-19', '2018-06-20', '../upload/113MyQRCODE1.png', '../upload/myImage_1529357214570_12.pdf', 5, 1),
(11, 114, 1, '2018-05-25', '2018-06-20', '2018-06-21', '../upload/114MyQRCODE1.png', '../upload/myImage_1529470468462_Pharmaceutical Distribution Syste2.pdf', 5, 1),
(8, 115, 1, '2018-06-12', '2018-06-20', '', '../upload/115MyQRCODE1.png', '../upload/myImage_1529470644998_abs.pdf', 4, 1),
(8, 116, 1, '2018-06-19', '2018-06-19', '2018-06-20', '../upload/116MyQRCODE1.png', NULL, 5, 1),
(11, 117, 1, '2018-06-19', '2018-06-20', '2018-06-21', '../upload/117MyQRCODE1.png', NULL, 5, 1),
(11, 118, 1, '2018-06-20', '2018-06-20', '2018-06-21', '../upload/118MyQRCODE1.png', '../upload/myImage_1529470407827_Pharmaceutical Distribution System32.pdf', 5, 1),
(11, 119, 1, '2018-06-20', '2018-06-20', '2018-06-21', '../upload/119MyQRCODE1.png', '../upload/myImage_1529474172383_aaa.pdf', 5, 1),
(11, 120, 0, '2018-06-20', NULL, NULL, NULL, '../upload/myImage_1534694086141_acs.pdf', NULL, 0),
(8, 121, 0, '2018-06-20', NULL, NULL, NULL, NULL, NULL, 0),
(11, 122, 1, '2018-08-14', '2018-08-15', '2018-08-31', '../upload/122MyQRCODE1.png', NULL, 5, 0),
(8, 123, 0, '2018-08-19', NULL, NULL, NULL, NULL, NULL, 0),
(11, 124, 0, '2018-08-19', NULL, NULL, NULL, NULL, NULL, 0),
(11, 125, 0, '2018-08-22', NULL, NULL, NULL, NULL, NULL, 0),
(11, 126, 1, '2018-08-22', '2018-08-22', '2018-08-22', '../upload/126MyQRCODE1.png', '../upload/myImage_1534943892120_Pharmaceutical Distribution System.pdf', 5, 1),
(12, 127, 0, '2018-08-22', NULL, NULL, NULL, NULL, NULL, 0),
(8, 128, 0, '2018-08-22', NULL, NULL, NULL, NULL, NULL, 0),
(8, 129, 0, '2018-08-22', NULL, NULL, NULL, NULL, NULL, 0),
(12, 130, 1, '2018-08-23', '2018-08-23', '2018-08-23', '../upload/130MyQRCODE1.png', NULL, 5, 1),
(12, 131, 1, '2018-08-24', '2018-08-24', '2018-08-24', '../upload/131MyQRCODE1.png', NULL, 5, 0);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `company_id` int(11) NOT NULL,
  `product_details` longtext NOT NULL,
  `price` double NOT NULL,
  `model` varchar(255) NOT NULL,
  `weight` varchar(255) NOT NULL,
  `unit_stock` varchar(11) NOT NULL,
  `special_list` tinyint(4) NOT NULL,
  `Image` varchar(255) NOT NULL,
  `new_list` tinyint(4) NOT NULL DEFAULT '0',
  `stock` int(11) NOT NULL DEFAULT '0',
  `brand` varchar(255) DEFAULT NULL,
  `reorder` int(11) DEFAULT NULL,
  `ex_time` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `company_id`, `product_details`, `price`, `model`, `weight`, `unit_stock`, `special_list`, `Image`, `new_list`, `stock`, `brand`, `reorder`, `ex_time`) VALUES
(4, 'BETASERC', 13, 'Tabs', 25, 'Tabs', '50mg', '50mg', 0, '../upload/beta.jfif', 0, 330, 'SPC', 100, 25),
(18, 'CCL ACASIA 250MG CAPSULES', 14, 'capsule', 150, 'capsule', '250mg', '250mg', 0, '../upload/myImage_1529439315284_Acacia-NoSeal-Front-Outline.jpg', 0, 40, 'SPC', 50, 20),
(23, 'pendole', 14, 'cedu', 50, 'table', '25mg', '100', 0, '../upload/myImage_1534944984710_Frontimage.jpg', 0, 0, NULL, 50, 30),
(12, 'AI - EPILEX CHRONO 500MG   ', 13, 'capsule', 2670, 'capsule', '50', '50', 1, '../upload/myImage_1524964308204_dentalac.jpg', 1, 205, 'ALKEM', 100, 30),
(13, 'ADPROPS', 13, 'bottel', 150, 'bottel', '5ml', '5ml', 1, '../upload/myImage_1524965957286_moxifloxacin-0-5-500x500.jpg', 1, 30, 'ABBOT', 80, 25),
(15, 'BETASERC 24 MG TABS', 13, 'Tabs', 25, 'Tabs', '50mg', '50mg', 1, '../upload/myImage_1529438416192_0104n0010.jpg', 0, 90, 'ALKEM', 40, 100),
(17, 'PHAMEVO-ORSLIM', 14, 'Capusal', 50, 'Capusal', '120', '120', 1, '../upload/myImage_1529439015774_orslim-orlistat.png', 0, 50, 'spc', 50, 20),
(16, 'DUPHAL,AC SYRUP 200ML', 13, 'Duphalac Laxative Syrup is a form of treatment for constipation that makes stool easier to pass by drawing water to the bowel. The active ingredient is lactulose, which is effective in treating constipation and allowing for the body to return to its natural state.', 350, 'Liquied', '200ML', '10 Bottel', 0, '../upload/myImage_1529438718502_43457339_B.jpg', 1, 15, 'AKILM', NULL, NULL),
(19, 'CCL ORINAC 1MG TABS', 14, '1mg/L Calcular la molaridad del ion cloruro del agua de mar. ...... Un comerciante de Tablets tiene una cierta cantidad de unidades marca ...... Sus riñones excretan muy poca orina C. El exceso de sal es eliminado por la .', 250, 'Tabs', '1mg', '100', 0, '../upload/myImage_1529439601728_download.jfif', 1, 80, 'ALKEM', NULL, NULL),
(20, 'BETASERC', 12, 'Tabs', 25, 'Tabs', '50mg', '50mg', 1, '../upload/myImage_1529439798011_download (1).jfif', 0, 92, 'Abbot', 40, 100),
(21, 'AI - EPILEX CHRONO 500MG   ', 12, 'Capusal', 40, 'Capusal', '500mg', '500mg', 0, '../upload/myImage_1529439984267_encorate.jpg', 1, 72, 'ALKEM', 120, 20),
(22, 'TILVIT SYRUP 120ML', 12, 'Vit A, Vit B12, Vit D3, Vit E, Western Remedies (India), Syrup, View Price. 2 ..... Hovite (120ml) ...... Tilvit (Inj). Vit A, D-Panthenol, Nicotinamide, Vit B1, Vit B2, Vit B6, Vit C, Vit D3, Vit E, Tablets (India) Limited, Injection, ', 120, 'Drink', '120ML', '10 Bottel', 0, '../upload/myImage_1530260334257_Becalm-Emecalm-Syrup-120ml.jpg', 0, 0, NULL, 100, 30);

-- --------------------------------------------------------

--
-- Table structure for table `recodes`
--

CREATE TABLE `recodes` (
  `user_id` int(11) NOT NULL,
  `oder_id` int(11) NOT NULL,
  `approval` tinyint(4) NOT NULL,
  `orderd_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `recodes`
--

INSERT INTO `recodes` (`user_id`, `oder_id`, `approval`, `orderd_time`) VALUES
(1, 1, 1, '2018-03-20 23:46:22'),
(8, 2, 1, '2018-03-21 00:15:48'),
(8, 3, 1, '2018-03-20 23:52:54'),
(8, 4, 1, '2018-03-21 00:42:40'),
(8, 5, 1, '2018-03-21 00:45:19'),
(8, 6, 1, '2018-03-21 00:48:15'),
(8, 7, 1, '2018-03-21 00:50:37'),
(8, 8, 1, '2018-03-21 00:56:30'),
(8, 9, 1, '2018-03-21 01:01:38'),
(8, 10, 1, '2018-03-21 01:06:25'),
(9, 11, 1, '2018-03-21 07:22:14'),
(10, 12, 1, '2018-03-21 11:45:53'),
(9, 13, 1, '2018-03-21 16:21:42'),
(9, 14, 1, '2018-03-21 16:29:49'),
(8, 15, 1, '2018-03-21 16:37:31'),
(8, 16, 1, '2018-03-21 16:39:29'),
(8, 17, 1, '2018-03-22 01:24:14'),
(8, 18, 1, '2018-03-22 01:25:44'),
(8, 19, 1, '2018-03-22 07:02:44'),
(8, 20, 1, '2018-03-22 07:22:59'),
(9, 21, 1, '2018-03-22 11:36:56'),
(9, 22, 1, '2018-03-22 11:41:08'),
(9, 23, 1, '2018-03-22 11:41:23'),
(8, 24, 1, '2018-03-23 00:25:46'),
(9, 25, 1, '2018-03-23 02:33:40'),
(10, 26, 1, '2018-03-24 22:55:09'),
(10, 27, 1, '2018-03-25 06:29:40'),
(10, 28, 1, '2018-03-25 06:32:31'),
(10, 29, 1, '2018-03-25 06:32:37'),
(10, 30, 1, '2018-03-25 06:35:41'),
(10, 31, 1, '2018-03-25 06:35:52'),
(10, 32, 1, '2018-03-25 06:36:01'),
(10, 33, 1, '2018-03-25 06:38:36'),
(10, 34, 1, '2018-03-25 06:40:22'),
(10, 35, 1, '2018-03-25 06:42:26'),
(10, 36, 1, '2018-03-25 06:42:48'),
(10, 37, 1, '2018-03-25 06:49:25'),
(10, 38, 1, '2018-03-25 06:49:42'),
(10, 39, 1, '2018-03-25 07:08:43'),
(10, 40, 1, '2018-03-25 07:12:18'),
(10, 41, 1, '2018-03-25 07:43:51'),
(10, 42, 0, '2018-03-25 07:46:29'),
(10, 43, 0, '2018-03-25 07:47:55'),
(10, 44, 0, '2018-03-25 07:52:04'),
(10, 45, 0, '2018-03-25 07:53:48'),
(10, 46, 0, '2018-03-25 07:55:02'),
(10, 47, 0, '2018-03-25 07:56:19'),
(10, 48, 0, '2018-03-25 07:59:48'),
(10, 49, 0, '2018-03-25 08:01:33'),
(10, 50, 0, '2018-03-25 08:04:16'),
(10, 51, 0, '2018-03-25 08:06:27'),
(10, 52, 0, '2018-03-25 08:17:43'),
(10, 53, 0, '2018-03-25 08:22:29'),
(10, 54, 0, '2018-03-25 08:30:36'),
(10, 55, 0, '2018-03-25 08:32:03'),
(10, 56, 0, '2018-03-25 08:35:43'),
(10, 57, 0, '2018-03-25 08:42:46'),
(10, 58, 0, '2018-03-25 08:47:50'),
(10, 59, 0, '2018-03-25 08:51:10'),
(10, 60, 0, '2018-03-25 08:52:35'),
(10, 61, 0, '2018-03-25 08:53:28'),
(10, 62, 0, '2018-03-25 08:55:17'),
(10, 63, 0, '2018-03-25 08:57:02'),
(9, 64, 1, '2018-03-25 14:40:08'),
(9, 65, 0, '2018-03-25 14:53:27'),
(9, 66, 0, '2018-03-25 22:55:12'),
(9, 67, 0, '2018-03-25 22:57:21'),
(9, 68, 1, '2018-03-26 00:44:30'),
(9, 69, 0, '2018-03-26 00:54:41'),
(12, 70, 1, '2018-03-28 07:37:25'),
(9, 71, 0, '2018-04-05 08:45:08'),
(9, 72, 0, '2018-04-05 08:45:09');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `batch_No` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `ex_date` varchar(255) NOT NULL,
  `qty` int(11) NOT NULL,
  `available` tinyint(4) NOT NULL DEFAULT '1'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`batch_No`, `product_id`, `ex_date`, `qty`, `available`) VALUES
(9, 7, '2018-10-31', 0, 0),
(10, 4, '2018-08-31', -50, 0),
(7, 6, '2018-11-30', 70, 1),
(13, 9, '2018-10-31', 120, 1),
(32, 4, '2018-10-30', 0, 0),
(17, 7, '2018-05-27', 0, 0),
(18, 7, '2018-07-26', 0, 0),
(20, 18, '2018-11-15', 20, 1),
(21, 12, '2019-01-24', 80, 0),
(22, 13, '2018-06-23', 0, 0),
(23, 15, '2019-07-26', 55, 1),
(24, 17, '2018-10-31', 50, 1),
(25, 16, '2018-09-29', 15, 1),
(26, 19, '2019-01-24', 15, 1),
(27, 20, '2018-12-29', 92, 1),
(28, 21, '2018-12-27', 72, 1),
(29, 12, '2020-04-24', 135, 1),
(30, 12, '2018-08-23', 0, 0),
(31, 12, '2018-06-23', -10, 0),
(33, 4, '2018-11-14', 80, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `pharmacy_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `tel_number` varchar(255) NOT NULL,
  `register_no` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `logo` varchar(255) NOT NULL,
  `Lat` varchar(255) NOT NULL,
  `Lon` varchar(255) NOT NULL,
  `approval` tinyint(4) NOT NULL DEFAULT '0',
  `isadmin` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `pharmacy_name`, `address`, `email`, `tel_number`, `register_no`, `password`, `logo`, `Lat`, `Lon`, `approval`, `isadmin`) VALUES
(10, 'Yasas', '80/1/A,Andadola', 'amilawicramarathna95@gmail.com', '0750504648', 'vdiehfo', '$2a$10$.XSSzpOOv3XfczjEYLIEW.81BRg.Y/Wsu38GdNyw1Z2Mewp2QiGlW', '../upload/amila.jfif', '6.925907140258861', '79.87428917999273', 1, 0),
(8, 'Amila ', '80/1/A,Andadola', 'amilawicramarathna95@gmail.com', '0750504648', 'scr-145', '$2a$10$P4r0Rc24xjNB139lGRe38u4iyiDDLeITOZdf.H1VBqUCjhWuAvwyO', '../upload/logo1.jpg\r\n\r\n', '6.937750399608691', '79.8674227249146', 1, 0),
(9, 'Dinura', 'Ambalangoda', 'hashi.14@gmail.com', '07505046478', 'tyuim', '$2a$10$nIwhazgVT/u41dp7WKblT.VpWAnzxnuSf8/VFiTvpgFQIs06lrtDG', '../upload/di.jpg', '', '', 1, 0),
(16, 'suwasetha', 'puttalam road,anuradapura', 'suwasetha@gmail.com', '0715423136', 'WH70002797', '$2a$10$ACfBzkZq1APvwysOp9lHdeB5WxUyf70dnxx27saWqRN9nMfB5IfUG', '../upload/myImage_1529431767351_logo1.jpg', '6.9271', '79.86120000000005', 0, 0),
(11, 'Gushan jayaweera', 'Gampaha', 'Gushan@gmail.com', '07894512', 'LLc-58947', '$2a$10$K29Hw0a0zp3cpHVI8GpLlubrKylASICt4loKmKtwdbaDdjAqyxNvG', '../upload/myImage_1522106219437_unnamed.jpg', '6.922967580163787', '79.88230362052923', 1, 0),
(12, 'Udeeptha', 'Kurunegala', 'Kippa@gmail.com', '0719756525', 'gurfbkif', '$2a$10$zHhO2sO7p6HU6CyfvPew7uXqOxkqZb5EBFClwofXL12o9llM3IUZS', '../upload/myImage_1522222572654_download.jfif', '6.94624924569602', '79.94327559585577', 1, 0),
(13, 'Shaminda', '80/1/A,Andadola', 'amilawicramarathna95@gmail.com', '0750504648', '7845795', '$2a$10$5oakjB.wMj8f58LjqMntauR1U/ZFuhGFVhT2a4S8dh20plffK.8Wi', '../upload/myImage_1525223837321_MPS_Community_Pharmacy_logo.png', '6.927994642825859', '79.88081231231695', 0, 0),
(42, 'Nipu', '56/3,', 'nipunaka@gmail.com', '0711220920', '6/2/i/02/3', '$2a$10$gM7WuSCN30yp7XQr4g3TpeFY7AEQCAbWyI7zvTw4qMdpJQMB3fkw6', '../upload/myImage_1534942737850_The-Music.jpg', '6.9272704082881695', '79.86317410583501', 1, 0),
(43, 'metro', 'mahawewa,', 'metro@gmail.com', '0719756525', '8/2/2/3/5', '$2a$10$gDGmQljlPYhqiOgbW.myKeW/2SSEq6s9e2Tavg.bepPeFtM6mI8n6', '../upload/myImage_1534991906022_The-Music.jpg', '6.9282502547500675', '79.86424698944097', 1, 0),
(35, 'aaaaaaaaaaa', 'aaaaaaaaaa', 'amila@gmial.com', '0758948963', 'aaa', '$2a$10$hIEA7I4EIit9Gpi.Iosy6.a7ClXdt4.HHXcwpvFtsfl8dJ2vyY4GC', '../upload/myImage_1534758481013_Capture.PNG', '6.926759183238967', '79.86673607940679', 0, 0),
(36, 'aaaaaaaaaaa', 'aaaaaaaaaa', 'amila@gmial.com', '0758948963', 'aaa', '$2a$10$nFzJEN.oyLnkSoSuf/Bh6OtBH/Id3BeykRJf7eUWHj5f9aVmuPQi6', '../upload/myImage_1534758544536_Capture.PNG', '6.926759183238967', '79.86673607940679', 0, 0),
(37, 'aaaaaaaaaaa', 'aaaaaaaaaa', 'amila@gmial.com', '0758948963', 'aaa', '$2a$10$BxyIks4SvO.7RrMoTbpFKuVSqgDjqon/FsLLYoG3RPCfY/li4U6I.', '../upload/myImage_1534758676701_Capture.PNG', '6.926759183238967', '79.86673607940679', 0, 0),
(38, 'aaaaaaaaaaa', 'aaaaaaaaaa', 'amila@gmial.com', '0758948963', 'aaa', '$2a$10$zdpzTVj9J7ZZ1kPAvL.ODuts/k0kztQxmy8B65pUgtq07cRu61IzG', '../upload/myImage_1534758746104_Capture.PNG', '6.926759183238967', '79.86673607940679', 0, 0),
(39, 'aaaaaaaaaaa', 'aaaaaaaaaa', 'amila@gmial.com', '0758948963', 'aaa', '$2a$10$2Mykyui5NGA3AAvmPHOhsOKMQDbOxYTPoczqF2yBpmFC9L9Uu1SBG', '../upload/myImage_1534758889270_Capture.PNG', '6.926759183238967', '79.86673607940679', 0, 0),
(40, 'aaaaaaaaaaa', 'aaaaaaaaaa', 'amila@gmial.com', '0758948963', 'aaa', '$2a$10$jybbmwZay97hfED./E6.g.Hx2NRNekN5HB2rcq1zRMfo584JH617K', '../upload/myImage_1534758971173_Capture.PNG', '6.926759183238967', '79.86673607940679', 0, 0),
(41, 'aaaaaaaaaaa', 'aaaaaaaaaa', 'amila@gmial.com', '0758948963', 'aaa', '$2a$10$BORtpg0IrLD3owZgto4rveCnb0feJJJwzpl89ODjPd7G4dWkOIBgK', '../upload/myImage_1534759010991_Capture.PNG', '6.926759183238967', '79.86673607940679', 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`company_id`);

--
-- Indexes for table `discuss`
--
ALTER TABLE `discuss`
  ADD PRIMARY KEY (`dis_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`batch_No`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `discuss`
--
ALTER TABLE `discuss`
  MODIFY `dis_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT for table `stock`
--
ALTER TABLE `stock`
  MODIFY `batch_No` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
