import { IsMongoId, IsString } from "class-validator";

export class GetMessagesDirectDto {
    @IsString()
    @IsMongoId()
    user_sender: string;

    @IsString()
    @IsMongoId()
    user_recipient: string;
}