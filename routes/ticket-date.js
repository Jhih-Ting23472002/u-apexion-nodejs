const express = require('express');
const db = require('../modules/connect-db');

const router = express.Router();

async function getDateListData(month){
    const sqldate = `SELECT * FROM ticket_date WHERE trip_month = ${parseInt(month)+1}`;
    const sqlseat = `SELECT * FROM seat_ordered_count`;
    // const sqldate = `SELECT DATE_FORMAT(departure_date, '%Y-%m-%d') FROM ticket_date WHERE trip_month = ${parseInt(month)+1}`;
    const[rsDate] = await db.query(sqldate);
    const[rsSeat] = await db.query(sqlseat);
    // const[rs2] = await db.query(sqldate);
    
    return [rsDate,rsSeat];
}

router.get('/api/date-list/:id',async(req,res)=>{
    console.log('123');
    res.json(await getDateListData(req.params.id))
})

module.exports = router;