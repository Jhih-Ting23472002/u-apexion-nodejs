const express = require('express');
const db = require('../modules/connect-db');
const router = express.Router();

async function getTravelIndexSearch(req,res){
    const sql = `SELECT * FROM travel_index WHERE travel_number = 'UAS-004'`;
    const [rs1] = await db.query(sql)
    return rs1;
}

router.get('/api/travel-choose-UAS-004',async(req,res)=>{
    res.json(await getTravelIndexSearch(req,res))
})

module.exports = router;