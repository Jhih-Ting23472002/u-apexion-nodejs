const { default: axios } = require("axios");
const express = require("express");
const db = require("../modules/connect-db");
const router = express.Router();

async function getProductNew(req, res) {
  const sql = `SELECT * FROM product_new`;
  const [rs1] = await db.query(sql);
  return rs1;
}
async function getProduct(req, res) {
  const sql = `SELECT * FROM product`;
  const [rs5] = await db.query(sql);
  return rs5;
}
//分類推薦
async function getProductMen(req, res) {
  const sql = `SELECT * FROM product WHERE category = 'Men' ORDER BY RAND() LIMIT 4`;
  const [rs2] = await db.query(sql);
  return rs2;
}
async function getProductWoman(req, res) {
  const sql = `SELECT * FROM product WHERE category = 'Woman' ORDER BY RAND() LIMIT 4`;
  const [rs3] = await db.query(sql);
  return rs3;
}
async function getProductShoes(req, res) {
  const sql = `SELECT * FROM product WHERE category = 'Shoes' ORDER BY RAND() LIMIT 4`;
  const [rs4] = await db.query(sql);
  return rs4;
}

//該項分類所有商品
async function getAllMen(req, res) {
  const sql = `SELECT * FROM product WHERE category ='Men' `;
  const [allMen] = await db.query(sql);

  const totalRows = `SELECT COUNT(1) FROM product WHERE category ='Men' `;
  const [allMentotalRows] = await db.query(totalRows);
  const allRows = allMentotalRows[0];
  const output = { allMen, allRows };
  return output;
}
async function getAllWoman(req, res) {
  const sql = `SELECT * FROM product WHERE category ='Woman' `;
  const [allWoman] = await db.query(sql);

  const totalRows = `SELECT COUNT(1) FROM product WHERE category ='Woman' `;
  const [allMentotalRows] = await db.query(totalRows);
  const allRows = allMentotalRows[0];
  const output = { allWoman, allRows };
  return output;
}
async function getAllShoes(req, res) {
  const sql = `SELECT * FROM product WHERE category ='Shoes' `;
  const [allShoes] = await db.query(sql);

  const totalRows = `SELECT COUNT(1) FROM product WHERE category ='Shoes' `;
  const [allMentotalRows] = await db.query(totalRows);
  const allRows = allMentotalRows[0];
  const output = { allShoes, allRows };
  return output;
}

// async function getAllRates(req, res) {
//   const response = await fetch("https://tw.rter.info/capi.php");
//   const [DailyForeignExchangeRates] = await response.json();
// }

//--------------------------------------------------------------------------------------
router.get("/api/getProduct-New", async (req, res) => {
  res.json(await getProductNew(req, res));
});
router.get("/api/getProduct", async (req, res) => {
  res.json(await getProduct(req, res));
});

//分類推薦
router.get("/api/getProductMen", async (req, res) => {
  res.json(await getProductMen(req, res));
});
router.get("/api/getProductWoman", async (req, res) => {
  res.json(await getProductWoman(req, res));
});
router.get("/api/getProductShoes", async (req, res) => {
  res.json(await getProductShoes(req, res));
});

//該項分類所有商品
router.get("/api/getAllMen", async (req, res) => {
  res.json(await getAllMen(req, res));
});
router.get("/api/getAllWoman", async (req, res) => {
  res.json(await getAllWoman(req, res));
});
router.get("/api/getAllShoes", async (req, res) => {
  res.json(await getAllShoes(req, res));
});
//每日匯率api
router.get("/api/DailyForeignExchangeRates", async (req, res) => {
  
  const response = await axios.get("https://tw.rter.info/capi.php")
  res.json(response.data)
});

module.exports = router;
