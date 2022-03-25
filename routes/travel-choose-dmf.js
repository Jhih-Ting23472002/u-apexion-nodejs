const express = require('express');
const db = require('../modules/connect-db');
const router = express.Router();

async function getTravelChooseM(req,res){
    const sql = `SELECT * FROM travel_index ORDER BY travel_index.travel_day DESC`;
    const [rs1] = await db.query(sql)
    return rs1;
}

async function getTravelChooseF(req,res){
    const sql = `SELECT * FROM travel_index ORDER BY travel_index.travel_day ASC`;
    const [rs2] = await db.query(sql)
    return rs2;
}

router.get('/api/travel-choosem',async(req,res)=>{
    res.json(await getTravelChooseM(req,res))
})
router.get('/api/travel-choosef',async(req,res)=>{
    res.json(await getTravelChooseF(req,res))
})

module.exports = router;