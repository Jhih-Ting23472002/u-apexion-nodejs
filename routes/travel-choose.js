const express = require('express');
const db = require('../modules/connect-db');
const router = express.Router();

async function getTravelProduct(req,res){
    const sql = `SELECT * FROM travel_index`;
    const [rs1] = await db.query(sql)
    return rs1;
}

router.get('/api/travel-product',async(req,res)=>{
    res.json(await getTravelProduct(req,res))
})

module.exports = router;