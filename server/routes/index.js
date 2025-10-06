import { Router } from "express";
import authRouter from "./AuthRoutes.js";

const appRouter = Router();

appRouter.use("/user", authRouter)

export default appRouter;
