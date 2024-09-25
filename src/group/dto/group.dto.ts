import { ArrayMaxSize, IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator"

export class GroupDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsArray()
    @ArrayMaxSize(50)
    members: string[]
}