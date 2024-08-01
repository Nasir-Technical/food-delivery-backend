import  Jwt  from "jsonwebtoken";


const authMiddleware = async (req,res,next) => {
   console.log("Yaha pe a rha shayad")
     const {token} = req.headers;
     if (!token) {
        return res.json({success:false,message:"Not Authorized Login Again"})
     }
     try {
        const token_decode = Jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
     } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
     }
}

export default authMiddleware;