const express = require('express')
const router = express.Router({mergeParams:true})


const { getcourse,getSingleCourse,addCourse,updateCourse,deleteCourse } = require('../Controllers/Course')
const { protect,authorize } = require('../Middleware/Auth')

router.route('/')
    .get(getcourse)
    .post(protect,authorize("publisher","admin"),addCourse)
    router.route('/:id')
    .put(protect,authorize("publisher","admin"),updateCourse)
    .get(getSingleCourse)
    .delete(protect,authorize("publisher","admin"),deleteCourse)

module.exports = router

