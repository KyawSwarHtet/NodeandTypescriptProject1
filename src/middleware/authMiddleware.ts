import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import User from "../model/userModel";
import { RequestData } from "../controllers/userController";

export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
    return { payload: decoded };
  } catch (error) {
    console.log(error);
    return { payload: null };
  }
};

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        /* Get token from header */
        token = req.headers.authorization.split(" ")[1];

        /* Verify token */
        const decoded: any = jwt.verify(token, `${process.env.JWT_SECRET}`);
        // const decoded: TokenPayload | JwtPayload = verifyJWT(token)

        console.log("decoded data", decoded);
        console.log("decoded data", decoded.id);

        /* Get user from the token */
        const reqUser: RequestData | any = await User.findById(
          decoded.id
        ).select("-password");
        if (reqUser) {
          next();
        } else {
          res.status(403).json("You are not allow to do that!");
        }
      } catch (error) {
        console.log(error);
        res.status(401); //not autorized code
        throw new Error("Not authorized");
      }
    }

    if (!token) {
      res.status(404);
      throw new Error("Not authorized, no token");
    }
  }
);

// const verifyTokenAndAuthorization = (req, res, next) => {
//   protect(req, res, () => {
//     if (req.user.id === req.params.id || req.user.isAdmin) {
//       next();
//     } else {
//       res.status(403).json("You are not allow to do that!");
//     }
//   });
// };

export default protect;

// module.exports = { protect };
