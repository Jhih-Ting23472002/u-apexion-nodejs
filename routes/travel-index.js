const express = require('express');
const db = require('../modules/connect-db');
const router = express.Router();

async function getTravelstarsign(req,res){
    const sql = `SELECT * FROM travel_index WHERE travel_hot = 'sv'`;
    const [rs1] = await db.query(sql)
    return rs1;
}

async function getTravelplanet(req,res){
    const sql = `SELECT * FROM travel_index WHERE travel_hot = 'pv'`;
    const [rs2] = await db.query(sql)
    return rs2;
}

router.get('/api/travel-starsign',async(req,res)=>{
    res.json(await getTravelstarsign(req,res))
})
router.get('/api/travel-planet',async(req,res)=>{
    res.json(await getTravelplanet(req,res))
})

module.exports = router;