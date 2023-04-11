import userModel from "../../DB/model/User.model.js";
import { asyncHandeler } from "../utils/errorHandling.js"
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";

export const auth =asyncHandeler(
    async(req,res,next)=>{
                const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARER_KEY)) {
            return res.json({ message: "In-valid bearer key" })
        }
                const token = authorization.split(process.env.BEARER_KEY)[1]
      
        if (!token) {
            return res.json({ message: "In-valid token" })
        }
        const decoded=verifyToken({token})
        if (!decoded?.id) {
            return res.json({ message: "In-valid token payload" })
        }
        const authUser = await userModel.findById(decoded.id).select('userName email role')
        if (!authUser) {
            return res.json({ message: "Not register account" })
        }
        // console.log(authUser);
        req.user = authUser;
                return next()
    }

)



 