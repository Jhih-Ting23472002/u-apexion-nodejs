const express = require('express');
const db = require('../modules/connect-db');
const router = express.Router();

async function getJourneyNotes(req,res){
    const sql = `SELECT * FROM journey_day2 WHERE Days = '8'`;
    const [rs1] = await db.query(sql)
    return rs1;
}

// async function getJourneyDouble(req,res){
//     const sql = `SELECT * FROM journey_day WHERE single_and_double = 'double'`;
//     const [rs2] = await db.query(sql)
//     return rs2;
// }

router.get('/api/travel-journeynotes',async(req,res)=>{
    res.json(await getJourneyNotes(req,res))
})

// router.get('/api/travel-journeydouble',async(req,res)=>{
//     res.json(await getJourneyDouble(req,res))
// })

module.exports = router;