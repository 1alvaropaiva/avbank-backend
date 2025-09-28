import { Router } from "express";
import { TransactionController } from "../controllers/transactionController";

const router = Router();
const transactionController = new TransactionController();

router.post("/deposit", transactionController.deposit);
router.post("/withdraw", transactionController.withdraw);
router.post("/transfer", transactionController.transfer);
router.get("/history/:accountId", transactionController.history);

export default router;
