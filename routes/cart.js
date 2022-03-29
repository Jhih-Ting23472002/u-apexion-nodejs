const express = require("express");
const db = require("../modules/connect-db");
const router = express.Router();

router.post('/order-list-post',async(req,res)=>{
    const orderListNumber = req.body.orderListNumber
    const userId = req.body.userId
    const productJTing = req.body.productJTing
    const productJTingQuantity = req.body.productJTingQuantity
    const productJTingPrice = req.body.productJTingPrice


    console.log('order-num',orderListNumber)
    const sql = "INSERT INTO `cart`(`order-list-checked`, `order-user-id`,`order-product-name`, `order-quantity`, `order-product-price`, `order-created-time`) VALUES (?,?,?,?,?,Now())"
    const [rs] = await db.query(sql,[
        orderListNumber,
        userId,
        JSON.stringify(productJTing), // 學了半年『 JSON.stringify 、 JSON.parse 』都不會用，我還能做什麼？？？ 0 貢獻？？？
        JSON.stringify(productJTingQuantity),
        JSON.stringify(productJTingPrice),
    ]);
    res.status(200).json(rs)
})

module.exports = router;