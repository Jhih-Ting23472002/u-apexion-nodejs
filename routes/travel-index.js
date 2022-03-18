const express = require('express');
const db = require('../modules/connect-db');
const router = express.Router();

async function getTravelindex(req,res){
    const sql = `SELECT * FROM travel_index WHERE travel_price = "199999"`;
    const [rs1] = await db.query(sql)
    return rs1;
}

async function getItinerarynotes(req,res){
    const sql = `SELECT * FROM itinerary_notes`;
    const [rs2] = await db.query(sql)
    return rs2;
}

router.get('/api/travel-index',async(req,res)=>{
    res.json(await getTravelindex(req,res))
})
router.get('/api/itinerary-notes',async(req,res)=>{
    res.json(await getItinerarynotes(req,res))
})

module.exports = router;