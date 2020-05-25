const express = require('express');
const session = require('express-session');
//const multer = require('multer');
const fs = require('fs');
//const upload = multer({dest:'tem-upload/'});
const upload = require(__dirname + '/upload-module');

const app = express();


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'dolkidf;lalsdfjls',
    cookie:{
        maxAge: 1200000
    }
}));
app.use((req, res, next) => {
    res.locals.sess = req.session || {};
    next();
});

app.get('/', (req, res) => {
    res.render('main', {name: 'Vic is cool', pageTitle: 'Liz is great'});
});

app.get('/try-upload', (req, res) => {
    res.render('try-upload');
});
/*
app.post('/try-upload',upload.single('avatar'), (req,res)=>{

    const output = {
        success: false,
        uploadedImg:'',
        nickname:'',
        errorMsg:'',
    }
    output.nickname=req.body.nickname || '';
    if (req.file && req.file.originalname){
        switch(req.file.mimetype) {
            case 'image/png':
            case 'image/jpeg':
                fs.rename(req.file.path,'./public/img'+req.file.originalname,error=>{
                    if(!error){
                        output.success= true;
                        output.uploadedImg= '/img/'+req.file.originalname;
                    }
                    res.render('try-upload',output);
                })
                break;
            default:
                fs.unlink(req.file.path,error=>{
                    output.errorMsg = 'false';
                    res.render('try-upload',output);
                })
        }
    }
    res.send('ok');
});
*/

app.post('/try-upload2', upload.single('avatar'), (req, res) => {
    console.log(req.file)
    res.send('ok')
});
app.get('/my-params1/:action?/:id?', (req, res) => {
    res.json(req.params)
})
app.get(/^\/mobile\/09\d{2}-?\d{3}-?\d{3}$/, (req, res) => {
    let url = req.url.slice(8).split('?')[0];
    url = url.split('-').join('');
    res.send('mobile: ' + url)
});
app.get('/sales-json', (req, res) => {
    const sales = require(__dirname + '/../data/sales');
    //res.json(data[2]);
    res.render('sales-json', {sales})
});
app.get('/try-session', (req, res) => {
    req.session.my_var = req.session.my_var || 0;
    req.session.my_var++;
    res.json({
        my_var: req.session.my_var,
        session: req.session
    })
});
app.get('/login', (req, res) => {
   res.render('login')
});
app.post('/login',upload.none(),(req,res)=>{
    const user = {
        'LizChia':{
            pass:'1234',
            nick:'Liz'
        },
        'AliceLin':{
        pass:'12345',
        nick:'Alice'
        }
    };
    const output = {
        success: false,
        body:req.body
    };
    if(user[req.body.account] && user[req.body.account].pass===req.body.password){
        output.success=true;
        req.session.user={
            id:req.body.account,
            nickname:user[req.body.account].nick
        }
    }
    output.sess_user = req.session.user;
    res.json(output);
});
app.get('/logout',(req,res)=>{
    delete req.session.user;
    res.redirect('/login')
});

app.get('/try-qs', (req, res) => {
    res.json(req.query)
});
app.get('/try-post-form', (req, res) => {
    // req.body.liz='liz';
    res.render('try-post-form', {pageTitle: 'Liz is great'});
});
// const urlencodedParser = express.urlencoded({extended:false});
app.post('/try-post-form', (req, res) => {
    // req.body.liz='liz';
    res.locals.pageTitle = 'webForm';
    res.render('try-post-form', req.body);
});
app.post('/try-json-post', (req, res) => {
    req.body.a = 'liz';
    res.json(req.body);
});
app.get('/pending', (req, res) => {

});
app.get('/ok', (req, res) => {
    res.send('ok');
});

// app.get('/a.html', (req, res)=>{
//     res.send('from route');
// });

const adminRouter = require(__dirname + '/admin/admin2.js')
app.use('/my', adminRouter);

app.use('/address_book', require(__dirname+'/address_book'));

app.use(express.static('public'));

app.use((req, res) => {
    res.status(404)
    res.send(`
    <h2>no result</h2>
    
    `)
})


app.listen(3000, () => {
    console.log('server started')
})