const express = require('express');
const db = require('../modules/connect-db');

const router = express.Router();

async function getSeatListData(res){
    const sql = `SELECT * FROM ticket_seat_ordered WHERE deperature_date = '${res.tripDate.dateSelected}' AND seat_carbin = '${res.seatCabin}';`;
    const[rs1] = await db.query(sql);
    console.log(rs1);
    return rs1;
}

router.post('/api/seat-list',async(req,res)=>{
    console.log('123');
    console.log(req.body);
    res.json(await getSeatListData(req.body))
})

module.exports = router;