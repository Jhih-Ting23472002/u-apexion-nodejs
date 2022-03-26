const express = require('express');
const db = require('../modules/connect-db');

const router = express.Router();

async function getPlantListData(req,res){
    const sql = `SELECT * FROM travel_index WHERE travel_sort = 'plant'`;
    const [rs1] = await db.query(sql)
    return rs1;
}

async function getStarsingListData(req,res){
    const sql = `SELECT * FROM travel_index WHERE travel_sort = 'starsign'`;
    const [rs2] = await db.query(sql)
    return rs2;
}

// console.log(rs1);

router.get('/api/plant-list',async(req,res)=>{
    res.json(await getPlantListData(req,res))
})

router.get('/api/starsing-list',async(req,res)=>{
    res.json(await getStarsingListData(req,res))
})

module.exports = router;