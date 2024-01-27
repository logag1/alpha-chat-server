import { Response, NextFunction } from 'express';
import { AuthRequest } from '../controller/request';
import { decodeToken } from '../utilities';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let decodeRes = decodeToken(req.headers.authorization!);
    if (!decodeRes) return res.status(401).json({ success: false, message: 'token expired' });

    req.userId = decodeRes.userId;

    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}