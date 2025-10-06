import {Router} from 'express'
import {register,login,logout,verifyUser} from "../controllers/AuthContollers.js"
import verifyToken from '../middlewares/tokenManager.js'

const authRouter = Router();

authRouter.post("/register",register);
authRouter.post("/login",login)
authRouter.get("/verify",verifyToken,verifyUser)
authRouter.get("/logout",verifyToken,logout)

export default authRouter
 
