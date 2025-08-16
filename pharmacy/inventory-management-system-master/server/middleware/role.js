export default function(roles = []){
  if(typeof roles === 'string') roles = [roles];
  return (req,res,next)=>{
    const user = req.user;
    if(!user) return res.status(401).json({msg:'Not authenticated'});
    if(roles.length && !roles.includes(user.role)) return res.status(403).json({msg:'Forbidden'});
    next();
  }
}
