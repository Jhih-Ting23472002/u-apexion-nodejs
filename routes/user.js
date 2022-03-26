const express = require("express");
const db = require("./../modules/connect-db");
const router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const nodemailer = require("nodemailer");

//驗證信發送設定
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "uuuuuuuapexion@gmail.com",
    pass: "ydhublwsjatzfznn",
  },
});

//登入檢查
router.post("/api/auth-list", async (req, res) => {
  const output = {
    success: false,
    error: "",
    info: "",
    //   token: "",
    code: 0,
  };
  // console.log("account:" + req.body.mem_account)
  //檢查是否獲得資料

  const [rs] = await db.query("SELECT * FROM user WHERE account=?", [
    req.body.account,
  ]);

  if (!rs.length) {
    output.error = "帳號密碼錯誤";
    output.code = 401;
    return res.json(output);
  }

  const row = rs[0];
  const compareResult = await bcrypt.compare(req.body.password, row.password);
  if (!compareResult) {
    output.error = "帳號密碼錯誤";
    output.code = 402;
    return res.json(output);
  }

  const { sid, account } = row;
  output.success = true;
  output.info = { sid, account };
  // output.token = jwt.sign({ mem_id, mem_account }, process.env.JWT_KEY);
  res.json(output);
});

//忘記密碼頁郵件驗證
router.post("/api/accountCheck", async (req, res) => {
  const output = {
    success: false,
    error: "",
    info: "",
    code: 0,
  };
  // console.log("account:" + req.body.mem_account)
  //檢查是否獲得資料

  const [rs] = await db.query("SELECT * FROM mem WHERE mem_account=?", [
    req.body.mem_account,
  ]);

  if (!rs.length) {
    output.error = "此用戶不存在";
    output.code = 403;
    return res.json(output);
  }

  const row = rs[0];

  const { mem_id, mem_account } = row;
  output.success = true;
  output.info = { mem_id, mem_account };

  const ranSixNum = () => {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += parseInt(Math.random() * 10);
    }
    return code;
  }; // 隨機生成6位數
  //發送驗證信
  const email = req.body.mem_account;
  let verify_code = ranSixNum();
  transporter
    .sendMail({
      from: '"Primeal" <injoe1001@gmail.com>', // 發信人
      to: email, //收信人
      subject: "印食密碼修改驗證信",
      html: `
      <p>修改您的密碼!</p>
      <p>您正在修改 Primeal 印食 的會員密碼</p> 
      <p>請您輸入以下驗證碼: <strong style="color: #841d29;">${verify_code}</strong></p> 
      <p>***此驗證碼五分鐘內有效***</p>`,
    })
    .then((info) => {
      console.log({ info });
    })
    .catch(console.error);
  output.success = true;
  output.verify_code = verify_code;

  res.json(output);
});
//忘記密碼頁驗證碼認證
router.post("/api/revise-pwd-vcode", async (req, res) => {
  const output = {
    success: false,
    errorMessage: "",
  };
  const memInpVcode = parseInt(req.body.validCode);
  const verify_code = parseInt(req.body.verify_code);

  if (memInpVcode === verify_code) {
    output.success = true;
  } else {
    output.errorMessage = "驗證碼輸入錯誤";
  }
  res.json(output);
});

//忘記密碼頁修改密碼
router.post("/api/reset-pwd", async (req, res) => {
  const output = {
    success: false,
    errorMessage: "",
  };
  const hash = await bcrypt.hash(req.body.newPassword, saltRounds);
  const sql = "UPDATE `mem` SET `mem_pwd`=? WHERE mem_id=?";

  const [result] = await db.query(sql, [hash, req.body.mem_id]);

  console.log(result);
  output.success = !!result.affectedRows;
  output.result = result;
  res.json(output);
});

//會員註冊router
router.post("/api/user-register", async (req, res) => {
  const output = {
    success: false,
    error: "",
  };
  // const memInpVcode = parseInt(req.body.registerData.memInpVcode);
  // const verify_code = parseInt(req.body.verify_code);

  const hash = await bcrypt.hash(req.body.registerData.password, saltRounds);
  const sql =
    "INSERT INTO `user`(`name`, `account`, `password`, `gender`, `birthday`,  `mobile`, `country`, `create_date`) VALUES (?,?,?,?,?,?,?,NOW())";

  try {
    let result;
    [result] = await db.query(sql, [
      req.body.registerData.name,
      req.body.registerData.account,
      hash,
      req.body.registerData.gender,
      req.body.registerData.birthday,
      req.body.registerData.mobile,
      req.body.registerData.country,
    ]);
    if (result.affectedRows === 1) {
      output.success = true;
    } else {
      output.error = "無法新增會員";
    }
  } catch (ex) {
    console.log(ex);
    output.error = "出現無法預期錯誤";
  }

  res.json(output);
});

//TODO 步驟3. 撰寫自己需要的router ,我這支是用mem_id找此id會員的所有資訊
//TODO 步驟4. 依照傳輸的資料是否需要夾帶token來決定是否要加上 auth.isToken這個中介層(這是用來幫忙過濾進來的使用者是否有帶token )
router.post("/api/find-user", async (req, res) => {
  const [rs] = await db.query("SELECT * FROM user WHERE sid=?", [req.body.sid]);
  const newData = rs.map((d) => {
    return { ...d, birthday: res.locals.toDateString(d.birthday) };
  });
  res.json(newData);
});

//會員資訊修改
router.post("/api/user-revise", async (req, res) => {
  const output = {
    success: false,
    error: "",
  };

  // console.log("body:" + req.body.memInfo.mem_nickname);

  const sql =
    "UPDATE `user` SET `name`=?,`mobile`=?,`gender`=?,`birthday`=?,`country`=? WHERE sid=?";

  const [result] = await db.query(sql, [
    req.body.memInfo.name,
    req.body.memInfo.mobile,
    req.body.memInfo.gender,
    req.body.memInfo.birthday,
    req.body.memInfo.country,
    req.body.sid,
  ]);

  console.log(result);
  output.success = !!result.affectedRows;
  output.result = result;
  res.json(output);
});

// // 查看會員地址的API
// router.get("/api/user-address", async (req, res) => {
//   const [rs] = await db.query("SELECT * FROM user_address WHERE 1");

//   res.json(rs);
// });

//新增收件地址router
router.post("/api/user-address-new", async (req, res) => {
  const output = {
    success: false,
    error: "",
  };
  console.log(req.body);
  // {
  //   placename: '公司',
  //   recipientname: 'sam',
  //   postalcode: '106',
  //   address: '台北市',
  //   phonenumber: '0988888999',
  //   user_id: '1'
  // }

  const sql = `INSERT INTO user_shipping_address (user_id, place_name, recipient_name, postal_code, address, phone_number) VALUES ( ?,?,?,?,?,? ) `;

  const [insertRS] = await db.query(sql, [
    req.body.user_id,
    req.body.placename,
    req.body.recipientname,
    req.body.postalcode,
    req.body.address,
    req.body.phonenumber
  ])
  console.log('RS:', insertRS)

  //     try {
  //       let result;
  //       [result] = await db.query(sql, [
  //         req.body.addressNewData.placename,
  //         req.body.addressNewData.recipientname,
  //         req.body.addressNewData.postalcode,
  //         req.body.addressNewData.address,
  //         req.body.addressNewData.phonenumber,

  //       ]);
        if (insertRS.affectedRows === 1) {
          output.success = true;
        } else {
          output.error = "新增地址失敗";
        }
      // } catch (ex) {
      //   console.log(ex);
      //   output.error = "出現無法預期錯誤";
      // }

    res.json(output);
});

//讀取地址資料
router.get("/api/get-user-address/:user_id", async (req, res) => {

  console.log('req.params.user_id:', req.params.user_id)

  const output = {
    success: false,
    error: "",
    list:'',
  };
  const user_id = req.params.user_id
  const sql = `SELECT * FROM user_shipping_address WHERE user_id = ${user_id}`;
  const [RS] = await db.query(sql)
  console.log('RS:', RS)

  if(RS.length){
    output.success=true;
    output.list = RS;
  } else{
    output.error = '沒有任何資料'
  }

  res.json(output);
})

//地址修改
router.post("/api/user-address-edit", async (req, res) => {
  const output = {
    success: false,
    error: "",
  };

  console.log('req.body',req.body)
  // console.log("body:" + req.body.memInfo.mem_nickname);

  const sql =
    `UPDATE user_shipping_address SET 
    
    place_name = ?,
    recipient_name = ?,
    postal_code = ?,
    address = ?,
    phone_number = ? WHERE sid= ? AND user_id = ?`;

  const [result] = await db.query(sql, [
    req.body.editData.placename,
    req.body.editData.recipientname,
    req.body.editData.postalcode,
    req.body.editData.address,
    req.body.editData.phonenumber,
    req.body.editData.sid,
    req.body.user_id
  ]);

  console.log(result);
  output.success = !!result.affectedRows;
  output.result = result;
  res.json(output);
});





module.exports = router;
