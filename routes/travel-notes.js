const express = require('express');
const db = require('../modules/connect-db');
const router = express.Router();

async function getJourneySingle(req,res){
    const sql = `SELECT * FROM journey_day WHERE single_and_double = 'single'`;
    const [rs1] = await db.query(sql)
    return rs1;
}

async function getJourneyDouble(req,res){
    const sql = `SELECT * FROM journey_day WHERE single_and_double = 'double'`;
    const [rs2] = await db.query(sql)
    return rs2;
}

router.get('/api/travel-journeysingle',async(req,res)=>{
    res.json(await getJourneySingle(req,res))
})

router.get('/api/travel-journeydouble',async(req,res)=>{
    res.json(await getJourneyDouble(req,res))
})

module.exports = router;