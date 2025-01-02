// src/types/express.d.ts
import { Request } from 'express';
import { RoleEnum } from '../src/user/enums/role.enum';

declare module 'express' {
  export interface Request {
    user?: {
      id: string;
      role: RoleEnum;
    };
  }
}
