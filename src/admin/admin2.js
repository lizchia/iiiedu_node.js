const express =  require('express');
const router = express.Router();
router.get('/admin2/:action?/:id?',(req,res)=>{
    const output = {
        ...req.params,
        baseURL: req.baseUrl,
        url:req.url,
    };
    res.json(output);
});
module.exports = router;