import { Router } from "express";
import authRouter from "./AuthRoutes";

const appRouter = Router();

appRouter.use("/user", authRouter)

export default appRouter;
