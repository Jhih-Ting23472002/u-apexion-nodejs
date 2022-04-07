const express = require("express");
const db = require("../modules/connect-db");
const router = express.Router();

router.post('/order-list-post',async(req,res)=>{
    const orderListNumber = req.body.orderListNumber
    const userId = req.body.userId
    const productJTingTina = req.body.productJTingTina
    const productJTingTinaQuantity = req.body.productJTingTinaQuantity
    const productJTingTinaPrice = req.body.productJTingTinaPrice
    console.log(productJTingTina) // 檢查


    console.log('order-num',orderListNumber)
    const sql = "INSERT INTO `cart`(`order_list_checked`, `order_user_id`,`order_product_name`, `order_quantity`, `order_product_price`, `order_created_time`) VALUES (?,?,?,?,?,Now())"
    const [rs] = await db.query(sql,[
        orderListNumber,
        userId,
        JSON.stringify(productJTingTina), // 『 JSON.stringify 、 JSON.parse 』？？？
        JSON.stringify(productJTingTinaQuantity),
        JSON.stringify(productJTingTinaPrice),
    ]);
    res.status(200).json(rs)
})

module.exports = router;