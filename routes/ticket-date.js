const express = require('express');
const db = require('../modules/connect-db');

const router = express.Router();

async function getDateListData(month){
    const sql = `SELECT * FROM ticket_date WHERE trip_month = ${parseInt(month)+1}`;
    // const sqldate = `SELECT DATE_FORMAT(departure_date, '%Y-%m-%d') FROM ticket_date WHERE trip_month = ${parseInt(month)+1}`;
    const[rs1] = await db.query(sql);
    // const[rs2] = await db.query(sqldate);
    
    return rs1;
}

router.get('/api/date-list/:id',async(req,res)=>{
    console.log('123');
    res.json(await getDateListData(req.params.id))
})

module.exports = router;