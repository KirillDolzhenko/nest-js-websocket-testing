import { Color, Prisma } from "@prisma/client";
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Max, MaxLength, Min, MinLength } from "class-validator";

export class UserDto {
    @IsString()
    @Min(1)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(7)
    @MaxLength(50)
    password: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    picUrl?: string;

    @IsOptional()
    @IsEnum(Color)
    picColor?: Color;
}

export class LogInUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(7)
    @MaxLength(50)
    password: string;

    @IsString()
    @IsEmail()
    email: string;
}

export class JWTUserDto {
    sub: string;
}


export class SettingsUserDto {
    @IsString()
    @Min(1)
    username: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    picUrl?: string;

    // @IsOptional()
    // @IsEnum(Color)
    // picColor?: Color;
}

export class AllUsersDto {
    @IsArray()
    @IsOptional()
    arrId: string[]
}
