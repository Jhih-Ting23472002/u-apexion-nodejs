const express = require('express');
const db = require('./../modules/connect-db');
const upload = require('./../modules/upload-imgs');

const router = express.Router();

async function getListData(req, res){
    const perPage = 5; // 每一頁最多幾筆
    // 用戶要看第幾頁
    let page = (req.query.page && parseInt(req.query.page)) ? parseInt(req.query.page) : 1;
    if(page<1){
        return res.redirect('/z/list');
    }
    const conditions = {};  // 傳到 ejs 的條件
    let search = req.query.search ? req.query.search : '';
    search = search.trim(); // 去掉頭尾空白
    let sqlWhere = ' WHERE 1 ';
    if(search){
        sqlWhere += ` AND \`travel_name\` LIKE ${db.escape('%'+search+'%')} `;
        conditions.search = search;
    }

    // 輸出
    const output = {
        // success: false,
        perPage,
        page,
        totalRows: 0,
        totalPages: 0,
        rows: [],
        conditions
    };

    const t_sql = `SELECT COUNT(1) num FROM travel_index ${sqlWhere} `;
    // return res.send(t_sql); // 除錯用
    const [rs1] = await db.query(t_sql);
    const totalRows = rs1[0].num;
    // let totalPages = 0;
    if(totalRows) {
        output.totalPages = Math.ceil(totalRows/perPage);
        output.totalRows = totalRows;
        if(page > output.totalPages){
            // 到最後一頁
            return res.redirect(`/travel-choose/list?page=${output.totalPages}`);
        }

        const sql = `SELECT * FROM \`travel_index\` ${sqlWhere} ORDER BY sid DESC LIMIT ${perPage*(page-1)}, ${perPage} `;
        const [rs2] = await db.query(sql);
        rs2.forEach(el=>{
            let str = res.locals.toDateString(el.travel_outbound, el.travel_inbound);
            if(str === 'Invalid date'){
                el.travel_outbound = '沒有輸入資料';
                el.travel_inbound = '沒有輸入資料';
            } else {
                el.travel_outbound = str;
                el.travel_inbound = str;
            }

        });
        output.rows = rs2;
    }

    return output;
}

router.get('/', async (req, res)=>{
    res.redirect('/travel-choose/list');
});
router.get('/list', async (req, res)=>{
    res.render('travel-choose/list', await getListData(req, res));
});
router.get('/api/list', async (req, res)=>{
    res.json(await getListData(req, res));
});

router.get('/add', async (req, res)=>{
    res.render('travel-choose/add');
});
// multipart/form-data
router.post('/add2', upload.none(), async (req, res)=>{
    res.json(req.body);
});
// application/x-www-form-urlencoded
// application/json
router.post('/add', async (req, res)=>{
    const output = {
        success: false,
        error: ''
    };
    /*
    const sql = "INSERT INTO travel_index SET ?";
    const obj = {...req.body, created_at: new Date()};

    const [result] = await db.query(sql, [obj]);
    console.log(result);
    */

    // TODO: 資料格式檢查
    const sql = "INSERT INTO `travel_index`(`travel_name`, `travel_description`, `travel_tags`, `travel_outbound`, `travel_inbound`, `travel_day`, `travel_price`) VALUES (?, ?, ?, ?, ?, NOW())";
    const [result] = await db.query(sql, [
        req.body.sid,
        req.body.travel_name,
        req.body.travel_description,
        req.body.travel_tags,
        req.body.travel_outbound || null,
        req.body.travel_inbound || null,
        req.body.travel_day,
        req.body.travel_price,
    ]);
    console.log(result);
    output.success = !! result.affectedRows;
    output.result = result;

    res.json(output);
});
router.get('/delete/:sid', async (req, res)=>{
    // req.get('Referer') // 從哪裡來
    const sql = "DELETE FROM travel_index WHERE sid=?";
    const [result] = await db.query(sql, [req.params.sid]);
    res.redirect('/travel-choose/list');
});

router.get('/edit/:sid', async (req, res)=>{
    const sql = "SELECT * FROM travel_index WHERE sid=?";
    const [rs] = await db.query(sql, [req.params.sid]);

    if(! rs.length){
        return res.redirect('/travel-choose/list');
    }

    res.render('travel-choose/edit', rs[0]);
});

router.post('/edit/:sid', async (req, res)=>{
    const output = {
        success: false,
        error: ''
    };

    const sql = "UPDATE `travel_index` SET ? WHERE sid=?";


    const [result] = await db.query(sql, [req.body, req.params.sid]);

    console.log(result);
    output.success = !! result.changedRows;
    output.result = result;

    res.json(output);
});

module.exports = router;