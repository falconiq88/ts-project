import express from 'express'
const router = express.Router();
import passport from 'passport'
import verified from '../../middlewares/verified'
import admin from '../../middlewares/role'
import {AddNewUser,updateUser,getUser,allUsers,deleteUser} from '../../controllers/adminController'



// middlewares
router.use(passport.authenticate("jwt", { session: false }))
router.use(verified)
router.use(admin)


// routes
 router.post('/admin/newUser', AddNewUser);
 router.get("/admin/allUsers",allUsers)
 router.get("/admin/user/:id",getUser)
 router.put("/admin/editUser/:id/",updateUser)
 router.delete("/admin/deleteUser/:id/",deleteUser)


 export default router;
