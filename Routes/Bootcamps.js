const express = require('express')
const Bootcamp = require('../Model/bootcamp')
const advancedResult = require('../Middleware/advancedResult')
const router = express.Router()

//destructure functions from controller/bootcamps.js

const { getBootcamp, getBootcamps, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampInRadius,uploadPhoto } = require('../controllers/bootcamps') 

const { protect,authorize } = require('../Middleware/Auth')

const courseRouter = require('../Routes/Course')

router.use('/:bootcampId/course',courseRouter)

router.route('/').get(advancedResult(Bootcamp,'Courses'), getBootcamps).post(protect,authorize("publisher","admin"),createBootcamp)

router.route('/:id').get(getBootcamp).put(protect,authorize("publisher","admin"),updateBootcamp).delete(protect,authorize("publisher","admin"),deleteBootcamp).put(protect,authorize("publisher","admin"),uploadPhoto)

router.route('/:id/photo').put(protect,authorize("publisher","admin"),uploadPhoto)

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius)

module.exports = router

