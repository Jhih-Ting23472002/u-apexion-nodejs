const express = require('express');
const db = require('../modules/connect-db');

const router = express.Router();

async function getTripListData(req,res){
    const sql = `SELECT * FROM travel_index WHERE travel_tags = 'plant_movie'`;
    const [rs1] = await db.query(sql)


    return rs1;
}

// console.log(rs1);

router.get('/api/list',async(req,res)=>{
    res.json(await getTripListData(req,res))
})

module.exports = router;