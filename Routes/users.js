// const express = require('express');
// const { getUsers,getUser,createUser,updateUser,deleteUser } = require('../controllers/users');
// const router = express.Router();
// const { protect,authorize } = require('../Middleware/Auth')


// // router.get('/getUsers',protect,getUsers)
// // router.get('/getUser',protect,getUser)
// // router.post('/createUser',protect,createUser)
// // router.get('/updateUser',protect,updateUser)
// // router.get('/deleteUser',protect,deleteUser)

// router.route('/')
//     .get(getUsers)
//     .post(protect,authorize("admin"),createUser)
//     router.route('/:id')
//     .put(protect,authorize("admin"),updateUser)
//     .get(getUser)
//     .delete(protect,authorize("admin"),deleteUser)
// module.exports = router;

const express = require('express');
const {
   getUsers,
   getUser,
   createUser,
   updateUser,
   deleteUser
} = require('../Controllers/users');

const User = require('../Model/User');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../Middleware/advancedResult')
const { protect, authorize } = require('../Middleware/Auth');

router.use(protect);
router.use(authorize('admin'));

router
   .route('/')
   .get(advancedResults(User), getUsers)
   .post(createUser);

router
   .route('/:id')
   .get(getUser)
   .put(updateUser)
   .delete(deleteUser);

module.exports = router;


