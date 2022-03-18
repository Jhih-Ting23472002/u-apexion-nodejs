const express = require("express");
const db = require("../modules/connect-db");
const router = express.Router();

async function getProductNew(req, res) {
  const sql = `SELECT * FROM product_new`;
  const [rs1] = await db.query(sql);
  return rs1;
}
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

router.get("/api/getProduct-New", async (req, res) => {
  res.json(await getProductNew(req, res));
});
router.get("/api/getProductMen", async (req, res) => {
  res.json(await getProductMen(req, res));
});
router.get("/api/getProductWoman", async (req, res) => {
  res.json(await getProductWoman(req, res));
});
router.get("/api/getProductShoes", async (req, res) => {
  res.json(await getProductShoes(req, res));
});

module.exports = router;
