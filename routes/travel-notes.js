const express = require('express');
const db = require('../modules/connect-db');
const router = express.Router();


async function getJourneyTitan(req,res){
    const sql = `SELECT * FROM journey_day2 WHERE Days = '8'`;
    const [rs1] = await db.query(sql)
    return rs1;
}

async function getJourneyXandar(req,res){
    const sql = `SELECT * FROM journey_day2 WHERE Days = '7'`;
    const [rs2] = await db.query(sql)
    return rs2;
}

async function getJourneyMann(req,res){
    const sql = `SELECT * FROM journey_day2 WHERE Days = '6'`;
    const [rs3] = await db.query(sql)
    return rs3;
}

router.get('/api/travel-journeytitan',async(req,res)=>{
    res.json(await getJourneyTitan(req,res))
})

router.get('/api/travel-journeyxandar',async(req,res)=>{
    res.json(await getJourneyXandar(req,res))
})

router.get('/api/travel-journeymann',async(req,res)=>{
    res.json(await getJourneyMann(req,res))
})



module.exports = router;