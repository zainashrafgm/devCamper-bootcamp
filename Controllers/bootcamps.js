const Bootcamp  = require('../Model/bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('express-async-handler')
const geocoder = require('../utils/geocoder')
const path= require('path')
const advancedResult= require('../Middleware/advancedResult')


// @desc    Get all bootcamps
// @Routes  Get /api/v1/bootcamps
// @access  Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    // // console.log(req.query)
    // let query;
    // // Copy  req.query
    // const reqQuery = { ...req.query }
 
    // const removeFields = ['select','sort','page','limit']

 
 
 
    // // Loop over remove fields and delete then from req.query
    //  removeFields.forEach(param => delete reqQuery[param])
    //  console.log(reqQuery)

     
  
    // console.log(reqQuery)
    // // Create query  string
    // let queryStr = JSON.stringify(reqQuery)
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    // console.log(queryStr)
 
    // // finding resource
    // query = Bootcamp.find(JSON.parse(queryStr)).populate('Courses')
 
    // // select  fields

    // if (req.query.select)
    // {
    //     const fields = req.query.select.split(',').join(' ');
    //     // console.log(fields)
    //     query = query.select(fields)
 
    // }
    // // sort
    // if (req.query.sort)
    // {
    //     const sortBy = req.query.sort.split(',').join(' ');
    //     query = query.sort(sortBy)
    // }
    // else
    // {
    //     query = query.sort('-createdAt')
    // }

    //     // pagination
    //     const page = parseInt(req.query.page,10) || 1;
    //     const limit = parseInt(req.query.limit,10) || 1;
    //     const startIndex = (page-1)*limit
    //     const endIndex = page*limit
    //     console.log(startIndex,"skips");
    //     const total = await Bootcamp.countDocuments()
    //     query = query.skip(startIndex).limit(limit)

    //     const pagination = {}
    //     if (endIndex < total)
    //     {
    //         pagination.next = {
    //             page: page + 1,
    //             limit
    //         }
    //     }
    //     if (startIndex > 0)
    //     {
    //         pagination.prev = {
    //             page: page - 1,
    //             limit
    //         }
    //     }


    

    // const bootcamps = await query
 
    // res.status(200).json({ sucess: true, count: bootcamps.length,pagination, data: bootcamps })
    res.status(200).json(res.advancedResult)
 
 })

// @desc    Get single bootcamp
// @Routes  Get /api/v1/bootcamps/:id
// @access  Public

exports.getBootcamp = asyncHandler( async (req, res, next) => {
       const bootcamp = await Bootcamp.findById(req.params.id)
       res.status(200).json({ success: true, data: bootcamp })

       if(!bootcamp){
            // return res.status(400).json({ sucess: false })
            next(new ErrorResponse(`Bootcamp not found with Id ${req.params.id}`,400))
       }

})

// @desc    Create new bootcamp
// @Routes  Post /api/v1/bootcamps
// @access  Private

exports.createBootcamp =  asyncHandler( async (req, res, next) => {

    req.body.user = req.user.id

    // check for published  bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })
 
    // if the  user is not an admin , they  can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin')
    {
 
        return next(new ErrorResponse(`The  user  with  ID ${req.user.id}  has already published a bootcamp`, 400))
    }
 

        const bootcamp = await Bootcamp.create(req.body);
        res.status(200).json({success: true, data: bootcamp});

})

// @desc    Update single bootcamp
// @Routes  Put /api/v1/bootcamps/:id
// @access  Private

// exports.updateBootcamp = asyncHandler( async (req, res, next) => {
//     const bootcamp = await Bootcamp.findById(req.params.id)
//     if (!bootcamp)
//     {
//         return res.status(400).json({ sucess: false })
//     }
//     res.status(200).json({
//         success: true,
//         data: bootcamp
//     });
// })

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);
 
    if (!bootcamp)
    {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }
 
    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
    {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this bootcamp`,
                401
            )
        );
    }
 
    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
 
    res.status(200).json({ success: true, data: bootcamp });
 });
   
 

// @desc    Delete single bootcamp
// @Routes  Delete /api/v1/bootcamps/:id
// @access  Private

// exports.deleteBootcamp = asyncHandler( async (req, res, next) => {
//     const bootcamp = await Bootcamp.findById(req.params.id);
//     if (!bootcamp)
//     {
//         return res.status(400).json({ sucess: false })
//     }
//     bootcamp.remove()
//     res.status(200).json({
//         success: true,
//         data: {}
//     }); 
// })


// @desc    Delete bootcamp
// @Routes  Delete /api/v1/bootcamps/:id
// @acess   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp)
    {
        return res.status(400).json({ sucess: false })
    }
 
    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
    {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete  this bootcamp`,
                401
            )
        );
    }
    bootcamp.remove()
    res.status(200).json({
        success: true,
        data: {}
    });
 
 
 })
 
 

// upload photo

exports.uploadPhoto = asyncHandler(async (req, res, next) => {



    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp)
    {
        return res.status(400).json({ sucess: false })
    }

    if (!req.files)
    {
        return next(
            new ErrorResponse(`please   upload   file`, 400)
        )
    }

    const file = req.files.file
    console.log(file)

    // // make sure your image is Photo

     if(!file.mimetype.startsWith('image'))
    {
            return next(new ErrorResponse(`plz upload an image file`, 400))
    }


  // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD)
    {
        return next(new ErrorResponse(`plz upload an image less then  ${process.env.MAX_FILE_UPLOAD}`, 400))

    }

    // create custom filename

    file.name = `photo${bootcamp._id}${path.parse(file.name).ext}`
    console.log(file.name);




    // if (!file.mimetype.startsWith('image'))
    // {
    //     return next(new ErrorResponse(`plz upload an image file`, 400))
    // }

  
    // Create  custom  Files 
file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err=>{
    if(err)
    {
        console.log(err); 
        return next(new ErrorResponse(`problem with file upload`,500))
    }
    await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name})
    res.status(200).json({
    sucess:true,
    data:file.name
    })
})

})



exports.getBootcampInRadius = asyncHandler(async (req,res, next)=>{
const{zipcode,distance} = req.params

const loc=await geocoder.geocode(zipcode);
const lat=loc[0].latitude
const lng=loc[0].longitude

const radius= distance/3963;

const bootcamps=await Bootcamp.find({
    location:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}
});

res.status(200).json({
    success:true,
    count:bootcamps.length,
    data:bootcamps
})

})

