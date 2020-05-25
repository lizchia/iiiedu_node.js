const express = require('express');
const moment = require('moment-timezone');
const upload = require(__dirname+'/upload-module')
const db = require(__dirname + '/db_connect2');

const router = express.Router();

router.get('/', (req, res)=>{
    res.redirect(req.baseUrl+'/list')
});
router.get('/del/:sid', (req, res)=>{
    let referer = req.get('Referer'); // 從哪裡來
    const sql = "DELETE FROM `address_book` WHERE sid=?";
    db.query(sql, [req.params.sid])
        .then(([r])=>{
            if(referer){
                res.redirect(referer)
            } else {
                res.redirect('/address_book/list')
            }
        })
});
router.get('/edit/:sid', (req, res)=>{
    const sql = "SELECT * FROM address_book WHERE sid=?";
    db.query(sql, [req.params.sid])
        .then(([r])=>{
            if(r && r.length){
                r[0].birthday = moment(r[0].birthday).format('YYYY-MM-DD');
                res.render('address_book/edit', r[0])
            } else {
                res.redirect('/address_book/list')
            }
        })
});
router.post('/edit', upload.none(), (req, res)=>{
    const output = {
        success: false,
        body: req.body
    }
    let sid = parseInt(req.body.sid);
    if(! sid){
        output.error = '沒有主鍵';
        return res.json(output);
    }
    const sql = "UPDATE `address_book` SET ? WHERE sid=?";
    delete req.body.sid;
    db.query(sql, [req.body, sid])
        .then(([r])=>{
            output.results = r;
            if(r.affectedRows && r.changedRows){
                output.success = true;
            }
            res.json(output);
        })
});
router.get('/add',(req,res)=>{
    res.render('address_book/add')
});
router.post('/add',upload.none(),(req,res)=>{
    const output ={
        success: false
    }
    const sql="INSERT INTO address_book set ?";
    req.body.created_at = new Date();
    db.query(sql,[req.body])
        .then(([r])=>{
            output.results=r;
            if(r.affectedRows && r.insertId){
                output.success = true;
            }
            res.json(output);
        })
});
const getDataList= async (req)=>{
    const perPage=5;
    let page = parseInt(req.params.page) || 1;
    const output ={
        perPage: perPage,
        totalRows:0,
        totalPage:0,
        rows:[]
    };
    const [r1]=await db.query("SELECT COUNT(1) num FROM address_book");
    output.totalRows=r1[0].num;
    output.totalPage= Math.ceil(output.totalRows/output.perPage);
    if(page<1)page=1;
    if(page>output.totalPage)page=output.totalPage;
    if(output.totalPage===0)page=0;
    output.page=page;
    if(! output.page){
        return output;
    }
    const sql =`SELECT * FROM address_book LIMIT ${(page-1)*perPage}, ${perPage}`;
    const [r2]= await db.query(sql);
    if(r2)output.rows=r2;
    for(let i of r2){
        i.birthday = moment(i.birthday).format('YYYY-MM-DD');
    }
    return output;
};
router.get('/list/:page?',async (req,res)=>{
    const output = await getDataList(req);
    res.render('address_book/list', output);
});

//async await寫法
// router.get('/list/:page?', async (req, res)=>{
//     const perPage=5;
//     let page = parseInt(req.params.page) || 1;
//     const output ={
//         perPage: perPage,
//         totalRows:0,
//         totalPage:0,
//         rows:[]
//     };
//     const [r1]=await db.query("SELECT COUNT(1) num FROM address_book");
//     output.totalRows=r1[0].num;
//     output.totalPage= Math.ceil(output.totalRows/output.perPage);
//     if(page<1)page=1;
//     if(page>output.totalPage)page=output.totalPage;
//     if(output.totalPage===0)page=0;
//     output.page=page;
//     if(! output.page){
//         return res.json(output);
//     }
//     const sql =`SELECT * FROM address_book LIMIT ${(page-1)*perPage}, ${perPage}`;
//     const [r2]= await db.query(sql);
//     if(r2)output.rows=r2;
//     res.render('address_book/list',output);
// })
//promise寫法
// router.get('/list:page?', (req, res)=>{
//     const perPage=5;
//     let page = parseInt(req.params.page) || 1;
//
//     const output ={
//         perPage: perPage,
//         totalRows:0,
//         totalPage:0,
//         rows:[]
//     }
//     db.query("SELECT COUNT(1) num FROM address_book")
//         .then(([r])=>{
//             output.totalRows=r[0].num;
//             output.totalPage= Math.ceil(output.totalRows/output.perPage);
//             if (page<1)page=1;
//             if(page>output.totalPage)page=output.totalPage;
//             if(output.totalPage===0)page=0;
//             output.page=page;
//             if(!output.page){
//                 return[null];
//             }else{
//                 const sql =`SELECT * FROM address_book LIMIT ${(page-1)*perPage}, ${perPage}`
//                 return db.query(sql)
//             }
//         })
//         .then(([r])=>{
//             if (r) output.rows=r;
//             res.json(output);
//         })
//         .catch(ex=>console.log(ex))
//    // db.query("SELECT* FROM address_book")
//    //     .then(([rows])=>{
//    //         res.render('address_book/list', { rows })
//    //     })
// })

module.exports = router;