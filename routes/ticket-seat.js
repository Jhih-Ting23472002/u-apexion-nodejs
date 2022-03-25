const express = require('express');
const db = require('../modules/connect-db');

const router = express.Router();

async function getSeatListData(){
    const sql = `SELECT * FROM ticket_date LEFT JOIN ticket_seat ON ticket_date.seat_id = ticket_seat.seat_id WHERE ticket_date.trip_month = ${parseInt(month)+1}`;
    // const sqldate = `SELECT DATE_FORMAT(departure_date, '%Y-%m-%d') FROM ticket_date WHERE trip_month = ${parseInt(month)+1}`;
    const[rs1] = await db.query(sql);
    // const[rs2] = await db.query(sqldate);
    console.log(rs1);
    
    return rs1;
}

router.get('/api/date-seat',async(req,res)=>{
    console.log('123');
    res.json(await getDateListData(req,res))
})

module.exports = router;