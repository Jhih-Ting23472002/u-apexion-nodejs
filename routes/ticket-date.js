const express = require('express');
const db = require('../modules/connect-db');

const router = express.Router();

async function getDateListData(req,res){
    const sql = `SELECT * FROM ticket_date WHERE trip_month = '1'`;
    const[rs1] = await db.query(sql);
    return rs1;
}

router.get('/api/date-list',async(req,res)=>{
    res.json(await getDateListData(req,res))
})

module.exports = router;