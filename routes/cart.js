const express = require("express");
const db = require("../modules/connect-db");
const router = express.Router();

router.post('/order-list-post',async(req,res)=>{
    const orderListNumber = req.body.orderListNumber
    console.log('order-num',orderListNumber)
    const sql = "INSERT INTO `cart`(`order-list-checked`, `order-user-id`, `order-created-time`) VALUES (?,?,Now())"
    const [rs] = await db.query(sql,[
        orderListNumber,
        8
    ]);
    res.status(200).json(rs)
})

module.exports = router;