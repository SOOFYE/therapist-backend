import { UserEntity } from "../../user/entities/user.entity";

export class CreateClientDto {

    id: string
    
    user: UserEntity
}
