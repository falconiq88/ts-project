//ts
import express from 'express'
import {Register, Login,changePassword,SendVerification,Verify } from '../../controllers/AuthController'
import {forgotPassword,resetPassword,updatePassword} from "../../controllers/NewPasswordController"
const router = express.Router();
import passport from 'passport'
import verified from '../../middlewares/verified'




// routes without middlewares
router.post('/register', Register);
router.get('/login', Login);

// forgot password routes
router.get('/forgot-password', forgotPassword)
router.get('/reset-password/', resetPassword)
router.get('/update-password/', updatePassword)

// account verification
router.get('/user/verify/:id/:token', Verify);

// routes with authentication middleware
router.use(passport.authenticate("jwt", { session: false }))


router.get('/sendVerification', SendVerification);

// routes with authentication and verified middlewares
router.use(verified)

router.post('/changePassword', changePassword)

router.get(
    "/user",  
    (req, res) => {
      res.json({
        data:{
          id:req.user.id,
          name:req.user.name,
          email:req.user.email,
          verified_at:req.user.verified_at
        }
        });
    }
  );



export default router;
