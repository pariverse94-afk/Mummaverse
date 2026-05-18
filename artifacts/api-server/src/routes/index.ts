import { Router, type IRouter } from "express";
import healthRouter from "./health";
import aiRouter from "./ai";
import inviteRouter from "./invite";
import deleteAccountRouter from "./delete-account";

const router: IRouter = Router();

router.use(healthRouter);
router.use(aiRouter);
router.use(inviteRouter);
router.use(deleteAccountRouter);

export default router;
