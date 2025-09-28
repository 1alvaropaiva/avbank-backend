import { Router } from "express";
import { AccountController } from "../controllers/accountController";

const router = Router();
const accountController = new AccountController();

router.post("/", accountController.createAccount);
router.get("/", accountController.getAllAccounts);
router.put("/:id", accountController.updateAccount);
router.delete("/:id", accountController.deleteAccount);

export default router;
