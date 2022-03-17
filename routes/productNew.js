const express = require('express');
const db = require('../modules/connect-db');
const router = express.Router();


async function getProductNew(req,res){
    const sql = `SELECT * FROM product_new`;
    const [rs1] = await db.query(sql)
    return rs1;
}
async function getProduct(req,res){
    const sql = `SELECT * FROM product_new`;
    const [rs1] = await db.query(sql)
    return rs1;
}

router.get('/api/getProductNew',async(req,res)=>{
    res.json(await getProductNew(req,res))
})

module.exports = router;