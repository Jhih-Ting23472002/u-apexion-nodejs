const express = require('express');
const db = require('../modules/connect-db');
const router = express.Router();

async function getTravelStarSign(req,res){
    const sql = `SELECT * FROM travel_index WHERE travel_hot = 'sv'`;
    const [rs1] = await db.query(sql)
    return rs1;
}

async function getTravelPlanet(req,res){
    const sql = `SELECT * FROM travel_index WHERE travel_hot = 'pv'`;
    const [rs2] = await db.query(sql)
    return rs2;
}

router.get('/api/travel-starsign',async(req,res)=>{
    res.json(await getTravelStarSign(req,res))
})
router.get('/api/travel-planet',async(req,res)=>{
    res.json(await getTravelPlanet(req,res))
})

module.exports = router;