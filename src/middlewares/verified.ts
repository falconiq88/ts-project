 function verified(req, res, next) {

    if (req.user.verified_at !=null) {
      return next();
    }
    else{
    res.status(401).json({message:'Please verify your account to access'});
    }
  }


   export default verified;
