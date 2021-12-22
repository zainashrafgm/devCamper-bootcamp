const express = require('express');
const {
   getReviews,
   getReview,
   addReview,
   updateReview,
   deleteReview
} = require('../Controllers/reviews');

const Review = require('../Model/Review');

const { protect, authorize } = require('../Middleware/Auth');


const router = express.Router({ mergeParams: true });

const advancedResults = require('../Middleware/advancedResult');
const { protect, authorize } = require('../Middleware/Auth');

router
   .route('/')
   .get(
       advancedResults(Review, {
           path: 'bootcamp',
           select: 'name description'
       })
    .post(protect,authorize('user','admin'),addReview),
       getReviews
   )



router
   .route('/:id')
   .get(  getReview )
   .put(protect,authorize('user','admin'),updateReview)
   .delete(protect,authorize('user','admin'),deleteReview)


module.exports = router;


