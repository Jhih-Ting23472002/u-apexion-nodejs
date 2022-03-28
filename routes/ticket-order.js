const express = require('express');
const db = require('../modules/connect-db');
var multer = require('multer')
var upload = multer({ dest: 'ticket_uploads/' })

const router = express.Router();

const member_name = [];

async function insertMembertData(req){
    member_name.push(req.body.memberName);
    // return console.log(req.body.memberName);
    // const sql = `INSERT INTO ticket_member(member_count, member_name, member_file) VALUES (${req.body.memberCounts},${req.body.memberName},${req.body.memberName})`;
    const sql = `INSERT INTO ticket_member(user_name,member_count, member_name, member_file) VALUES ('USER',${req.body.memberCounts},?,?)`;
    const[rs1] = await db.query(sql,[`${req.body.memberName}`,`${req.files.fieldname}`]);
    console.log(rs1);
    return rs1;
}

async function getMembertData(req,res){
    const sql = `SELECT member_name FROM ticket_member WHERE user_sid = '7'`;
    const [rs2] = await db.query(sql);
    return rs2;
}

router.get('/api/order-list',async(req,res)=>{
    res.json(await getMembertData(req,res))
})

router.post('/api/order-list',upload.array('memberFiles',12),async(req,res)=>{
    console.log('訂票首頁');
    // console.log(req.body,req.files);
    res.json(await insertMembertData(req))
})

module.exports = router;