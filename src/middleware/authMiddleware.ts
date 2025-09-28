import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ message: "Token não fornecido" });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(403).json({ message: "Token inválido" });
    return;
  }

  (req as any).user = decoded; // injeta user no request
  next();
}
