console.log(process.env.NODE_ENV);

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const moment = require('moment-timezone');
const multer = require('multer');
// const upload = multer({dest: 'tmp_uploads/'});
const upload = require(__dirname + '/modules/upload-imgs');
const fs = require('fs').promises;
const db = require('./modules/connect-db');
//新增資料表在Mysql
const sessionStore = new MysqlStore({}, db);
const cors = require('cors');
const fetch = require('node-fetch');
const axios = require('axios');

const app = express();

app.set('view engine', 'ejs');
/*
app.get('/a.html', (req, res)=>{
    res.send(`<h2>動態內容</h2><p>${Math.random()}</p>`);
});
*/

// Top-level middleware
const corsOptions = {
    credentials: true,
    origin: function(origin, cb){
        console.log({origin});
        cb(null, true);
    }
};
app.use(cors(corsOptions));
app.use(express.urlencoded({extended: false})); // application/x-www-form-urlencoded
app.use(express.json()); // application/json
app.use(express.static('public'));
app.use('/joi', express.static('node_modules/joi/dist/'));

app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'sdkfkdh984576894kjdkgjhdfkkjdfgjkfjsdfjhskAAAkdfjdsf',
    store: sessionStore,
    cookie: {
        maxAge: 1200000
    }
}));
// 自訂的 頂層 middleware
app.use((req, res, next)=>{
    res.locals.shin = '哈囉';
    // res.send('oooo'); // 回應之後, 不會往下個路由規則

    // template helper functions 樣版輔助函式
    res.locals.toDateString = d => moment(d).format('YYYY-MM-DD');
    res.locals.toDatetimeString = d => moment(d).format('YYYY-MM-DD HH:mm:ss');


    next();
});


//訂票行程選擇頁
app.use('/ticket-trip',require('./routes/ticket-trip'))

//訂票日期選擇頁
app.use('/ticket-date',require('./routes/ticket-date'))

//訂票座位選擇頁
app.use('/ticket-seat',require('./routes/ticket-seat'))

//周邊商品頁
app.use('/product',require('./routes/product'))

//行程首頁
app.use('/travel-index',require('./routes/travel-index'))

//全行程選擇頁
app.use('/travel-choose',require('./routes/travel-choose'))
app.use('/travel-choose-pmf',require('./routes/travel-choose-pmf'))
app.use('/travel-choose-dmf',require('./routes/travel-choose-dmf'))

//行程詳細頁
app.use('/travel-notes',require('./routes/travel-notes'))

//會員頁
app.use('/user',require('./routes/user'))



// ********** 所有路由的後面
app.use( (req,res)=>{
    res.status(404).send(`<h2>走錯路了</h2>`);
});

const port = process.env.PORT || 3001;
app.listen(port, ()=>{
    console.log(`server started: ${port} - `, new Date());
});