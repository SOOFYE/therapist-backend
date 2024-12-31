import { RoleEnum } from "../../user/enums/role.enum"

export interface JwtPayload {

    role: RoleEnum,
    sub: string

}