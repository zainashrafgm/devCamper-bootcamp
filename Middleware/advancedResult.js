
const advancedResult=(models,populate)=>async(req,res , next)=>{


    
// @desc    Get all bootcamps
// @Routes  Get /api/v1/bootcamps
// @access  Public

    // console.log(req.query)
    let query;
    // Copy  req.query
    const reqQuery = { ...req.query }
 
    const removeFields = ['select','sort','page','limit']

 
 
 
    // Loop over remove fields and delete then from req.query
     removeFields.forEach(param => delete reqQuery[param])
     console.log(reqQuery)

     
  
    console.log(reqQuery)
    // Create query  string
    let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    console.log(queryStr)
 
    // finding resource
    query = models.find(JSON.parse(queryStr)).populate('Courses')
 
    // select  fields

    if (req.query.select)
    {
        const fields = req.query.select.split(',').join(' ');
        // console.log(fields)
        query = query.select(fields)
 
    }
    // sort
    if (req.query.sort)
    {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    }
    else
    {
        query = query.sort('-createdAt')
    }

        // pagination
        const page = parseInt(req.query.page,10) || 1;
        const limit = parseInt(req.query.limit,10) || 1;
        const startIndex = (page-1)*limit
        const endIndex = page*limit
        console.log(startIndex,"skips");



        const total = await models.countDocuments()
        query = query.skip(startIndex).limit(limit)

        if(populate)
        {
            query=query.populate(populate)
        }

        const pagination = {}
        if (endIndex < total)
        {
            pagination.next = {
                page: page + 1,
                limit
            }
        }
        if (startIndex > 0)
        {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }


    

    const result = await query
 


    res.advancedResult={
        sucess:true,
        count:result.length,
        data:result
    }
    next()

    // res.status(200).json({sucess : true, count : result, pagination, data : result})
}

module.exports=advancedResult