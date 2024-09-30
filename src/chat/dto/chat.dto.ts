import { MessageType, RecipientType } from '@prisma/client';
import { IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";

export class GetMessagesDirectDto {
    @IsString()
    @IsMongoId()
    user_sender: string;

    @IsString()
    @IsMongoId()
    user_recipient: string;
}

export class SendMessageDto {
    @IsString()
    content: string;

    @IsEnum(RecipientType)
    recipientType: RecipientType;

    @IsEnum(MessageType)
    messageType: MessageType;

    @IsString()
    @IsMongoId()
    recipient: string;
}