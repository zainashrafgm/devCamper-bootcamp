
// @desc logs request to console

const loggers = (req,res,next)=>{
    console.log(`${req.method} ${req.protocol}://${req.get('host')} ${req.originalUrl}`);
    next()
}
module.exports=loggers