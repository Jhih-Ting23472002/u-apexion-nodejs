const express = require('express');
const db = require('../modules/connect-db');
const upload = require('../modules/upload-imgs');
const router = express.Router();


async function getListData(req, res){
    const perpage = 5 ;
    let page = req.query.page ? parseInt(req.query.page):1;
    if(page<1){
        return res.redirect('/forum_index/list')
    }
    const conditions = {};  // 傳到 ejs 的條件

    const output = {
        perpage,
        page,
        totalRows:0,
        totalPages:0,
        rows:[],
        conditions
    };

    const t_sql = "SELECT COUNT(1) num FROM forum_article";
    const [rs1]= await db.query(t_sql);
    const totalRows = rs1[0].num;
    let totalPages=0; 
    if (totalRows){
        output.totalPages = Math.ceil(totalRows/perpage);
        output.totalRows = totalRows;
        // 轉向到最後一頁
        if(page>output.totalPages){
            return res.redirect(`/forum_index/list?page=${output.totalPages}`)
        }

        const sql = ` SELECT * FROM forum_article LEFT JOIN forum_category ON forum_category.cat_sid = forum_article.art_category_sid ORDER BY forum_article.forum_sid DESC LIMIT ${perpage*(page-1)},${perpage}`;
        const [rs2] = await db.query(sql);
        output.rows = rs2;
    }
    // res.render('forum/forum_index',output);
    return output;
}
router.get('/', async (req, res)=>{
    res.redirect('/forum_index/list');
});
// router.get('/list', async (req, res)=>{
//     res.render('forum_index/list', await getListData(req, res));
// });
router.get('/api/list', async (req, res)=>{
    res.json(await getListData(req, res));
});
router.get('/list/:sid',async (req, res)=>{
    const sql = "SELECT * FROM forum_article LEFT JOIN forum_category ON forum_category.cat_sid = forum_article.art_category_sid LEFT JOIN user ON user.sid=forum_article.forum_user_sid WHERE forum_article.forum_sid = ? ORDER BY forum_article.forum_sid DESC";
    const [rs] = await db.query(sql,[req.params.sid]);
    if(! rs.length){
        return res.json(await getListData(req, res));
    }
    res.status(200).json(rs[0]);
})

// 串到留言數的api
router.get('/getAll',async(req,res)=>{
    const sql = `SELECT * FROM forum_article LEFT JOIN forum_category ON forum_category.cat_sid = forum_article.art_category_sid LEFT JOIN user ON user.sid=forum_article.forum_user_sid ORDER BY forum_article.art_create_time DESC`;
    const [rs] = await db.query(sql);
    if(! rs.length){
        return res.json(await db.query(req, res)===0);
    }
    res.status(200).json(rs);
})

// hot貼文
router.get('/getSort-hot-posts',async(req,res)=>{
    const sql = `SELECT forum_article.*, forum_response.res_art_sid,forum_category.*,user.*, COUNT(forum_response.res_art_sid) AS res_count FROM forum_response LEFT JOIN forum_article ON forum_article.forum_sid = forum_response.res_art_sid LEFT JOIN forum_category ON forum_article.art_category_sid = forum_category.cat_sid LEFT JOIN user ON forum_article.forum_user_sid=user.sid GROUP BY forum_response.res_art_sid ORDER BY forum_article.article_likes DESC`;
    const [rs] = await db.query(sql);
    if(! rs.length){
        return res.json(await db.query(req, res)===0);
    }
    res.status(200).json(rs);
})

router.get('/UApexion-article',async(req,res)=>{
    const sql =  `SELECT * FROM forum_article LEFT JOIN forum_category ON forum_category.cat_sid = forum_article.art_category_sid LEFT JOIN user ON user.sid=forum_article.forum_user_sid WHERE forum_user_sid=2 ORDER BY forum_article.forum_sid DESC`;
    const [rs] = await db.query(sql);
    if(! rs.length){
        return res.json(await getListData(req, res));
    }
    res.status(200).json(rs);
})

router.get('/article-category/:art_category_sid',async(req,res)=>{
    console.log(req.params.art_category_sid)
    const sql =  `SELECT * FROM forum_article LEFT JOIN forum_category ON forum_category.cat_sid = forum_article.art_category_sid LEFT JOIN user ON user.sid=forum_article.forum_user_sid WHERE art_category_sid=? ORDER BY forum_article.art_create_time DESC`;
    const [rs] = await db.query(sql,[req.params.art_category_sid]);
    if(! rs.length){
        return res.json(await getListData(req, res)===null);
    }
    res.status(200).json(rs);
})

router.get('/all-res-list',async (req, res)=>{
    const sql1 = "SELECT * FROM forum_response LEFT JOIN user ON forum_response.user_sid=user.sid ORDER BY forum_response.sid";
    const [rs] = await db.query(sql);
    if(! rs.length){
        return res.json(await getListData(req, res));
    }
    res.status(200).json(rs);
})
router.get('/res-list/:res_art_sid',async (req, res)=>{
    const sql = "SELECT * FROM forum_response LEFT JOIN user ON forum_response.user_sid=user.sid WHERE res_art_sid = ? ORDER BY forum_response.sid DESC";
    const [rs] = await db.query(sql,[req.params.res_art_sid]);
    if(! rs.length){
        return res.json(await getListData(req, res)===null);
    }
    res.status(200).json(rs);
})
// 刪除文章的路由
router.get('/list-delete/:sid',async (req, res)=>{
    const sql = "DELETE FROM forum_article WHERE forum_sid=?";
    const [rs] = await db.query(sql,[req.params.sid]);
    res.status(200).json(rs);
})

// 留言
router.post('/res-list/:res_art_sid',async (req, res)=>{
    const artSid = req.params.res_art_sid
    var res_content = req.body.res_content
    // console.log('artSid',artSid);
    // console.log('res_content',res_content);
    const sql1 = "INSERT INTO `forum_response`(`user_sid`, `res_art_sid`, `res_content`, `res_time`) VALUES (?,?,?, NOW())"
    const sql2 = "UPDATE `forum_article` SET `article_comments`=(SELECT COUNT(1) FROM `forum_response` WHERE `res_art_sid`=?) WHERE forum_sid=?"
    const [rs1] = await db.query(sql1,[
        3,
        artSid,
        res_content,
    ])
    const [rs2] = await db.query(sql2,[
        artSid,
        artSid,
    ])
})
// 發文
router.post('/forumArticle_insert',upload.single('avatar'), async (req, res)=>{
    const art_category_sid = req.body.art_category_sid
    const art_title = req.body.art_title
    const art_content = req.body.art_content
    const hashtag1 = req.body.hashtagone
    const hashtag2 = req.body.hashtagtwo
    console.log('art_category_sid',art_category_sid);
    console.log('art_title',art_title);

    const sql = "INSERT INTO `forum_article`(`forum_user_sid`, `art_category_sid`, `art_title`, `art_content`, `hashtag1`, `hashtag2`, `art_photo`,`article_likes`,`article_save`,`art_create_time`) VALUES (?,?,?,?,?,?,?,?,?,Now())"
    const [rs] = await db.query(sql,[
       23,
       art_category_sid,
       art_title,
       art_content,
       hashtag1,
       hashtag2,
       req.file.filename || null,
       0,
       0,
    ])
})
// 修改文章
router.post('/forumArticle_update/:sid',upload.single('avatar'),async (req, res)=>{
    const art_category_sid = req.body.art_category_sid
    const art_title = req.body.art_title
    const art_content = req.body.art_content
    const hashtag1 = req.body.hashtagone
    const hashtag2 = req.body.hashtagtwo
    console.log('art_category_sid',art_category_sid);
    console.log('art_title',art_title);

    const sql = "UPDATE `forum_article` SET `art_category_sid`=?,`art_title`=?,`art_content`=?,`hashtag1`=?,`hashtag2`=?,`art_photo`=? WHERE forum_sid=?"
    const [rs] = await db.query(sql,[
        art_category_sid,
        art_title,
        art_content,
        hashtag1,
        hashtag2,
        req.file.filename || null,
        // null,
        req.params.sid 
    ]
    )
})


module.exports = router;