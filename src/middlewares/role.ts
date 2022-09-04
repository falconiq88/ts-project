function admin( req, res, next) {
 

    if (req.user.role =="admin") {
        return next();
      }
      else{
      res.status(401).json({message:'This route for admins only'});
      }
  }


export default admin;
 