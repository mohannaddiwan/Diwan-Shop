exports.isAuthcuated = (req,res,next)=> {

    if(!req.session.isAuthcuated){

      req.session.urlTo = req.url;
      return  res.redirect("/login");
    }
    
    next()
}

// exports.noAnyUser = (req,res,next)=> {

//   if(!req.session.user){

//     req.session.urlTo = req.url;
//     return  res.redirect("/");
//   }
  
//   next()
// }

exports.isAdmin = (req,res,next)=> {


  if (!req.session.A){
    res.redirect("/")
  }
  next()
}