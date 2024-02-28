import jwt from 'jsonwebtoken' ;


 
export function auth (req, res, next)  {
    
   try {
    const token = req.headers.authorization.split(' ')[1];    
       const decodedToken = jwt.verify(token, ""+process.env.JWT_SECRET);
       const userId = decodedToken.userId;
       const email = decodedToken.email;
       const password = decodedToken.password;
       req.auth = {
           userId: userId,
           email: email, 
           password: password,   
       };
	next();
   } catch(error) {
       res.status(401).json({message : 'user is not authenticated'});
   }
}


export default auth;