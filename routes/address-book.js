const express = require('express');
const db = require('./../modules/connect-db');
const upload = require('./../modules/upload-imgs');

const router = express.Router();

router.get('/', async (req, res)=>{
    const sql = `SELECT * FROM 'product'`;
    const [rs] = await db.query(sql);
    res.json(rs);
});





module.exports = router;