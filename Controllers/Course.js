const Course = require('../Model/Course')
const Bootcamp = require('../Model/bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../Middleware/async')

// @desc Get All Courses
// @acess Publi
// exports.getallcourses = asyncHandler(async (req, res, next) => {
//     const Schemacourse = await Course.find()
//     res.status(200).json({ success: true, data: Schemacourse })

//     if (!Schemacourse) {
//         next(new ErrorResponse(`Bootcamp not found`))
//         // res.status(400).json({ sucess: false })
//     }

// })



// bootcamp:id/course
exports.getcourse = asyncHandler(async (req, res, next) => {
    let query;


    if (req.params.bootcampId) {
        query = Course.find({bootcamp:req.params.bootcampId})
        console.log('if');
    }
    else{
        query = Course.find().populate({
            path:'bootcamp',
            select:'name description'
        })
        console.log('else');
    }
    const course= await query
    res.status(200).json({success:true,count:course.length,data:course})

})


// bootcamp:id/course
exports.getSingleCourse = asyncHandler(async (req, res, next) => {
const courses= await Course.findById(req.params.id).populate({
    path:'bootcamp',
    select:'name description'
})

    if (!courses) {
        return next(new ErrorResponse(`No course with then id of ${req.params.id}`),404)
    }
   
    res.status(200).json({success:true,count:courses.length,data:courses})

})
// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
 
    if (!bootcamp)
    {
        return next(
            new ErrorResponse(
                `No bootcamp with the id of ${req.params.bootcampId}`,
                404
            )
        );
    }
 
    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
    {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
                401
            )
        );
    }
 
    const course = await Course.create(req.body);
 
    res.status(200).json({
        success: true,
        data: course
    });
 });

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);
   
    if (!course)
    {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
      );
    }
   
    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin')
    {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update course ${course._id}`,
          401
        )
      );
    }
   
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
   
    course.save();
   
    res.status(200).json({
      success: true,
      data: course
    });
   });
   
   
   
   // @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
   
    if (!course)
    {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
      );
    }
   
    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin')
    {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete course ${course._id}`,
          401
        )
      );
    }
   
    await course.remove();
   
    res.status(200).json({
      success: true,
      data: {}
    });
   });
   
   
   
//  // @desc      Add course
// // @route     POST /api/v1/bootcamps/:bootcampId/courses
// // @access    Private
// exports.addCourse = asyncHandler(async (req, res, next) => {
//     req.body.bootcamp = req.params.bootcampId;
//     req.body.user = req.user.id;
//     const bootcamp = await Bootcamp.findById(req.params.bootcampId);
 
//     if (!bootcamp)
//     {
//         return next(
//             new ErrorResponse(
//                 `No bootcamp with the id of ${req.params.bootcampId}`,
//                 404
//             )
//         );
//     }
 
//     // Make sure user is bootcamp owner
//     if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin')
//     {
//         return next(
//             new ErrorResponse(
//                 `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
//                 401
//             )
//         )
//     }
 
//     const course = await Course.create(req.body);
 
//     res.status(200).json({
//         success: true,
//         data: course
//     });
//  });
 
 
 