import { Request } from "express";

import { IJWTPlayload } from "./global.types";

declare global {
    namespace Express{
        interface Request {
            user: IJWTPlayload
        }
    }
}