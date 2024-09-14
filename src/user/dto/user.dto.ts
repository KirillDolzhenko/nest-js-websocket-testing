import { Color, Prisma } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Max, Min } from "class-validator";

export class UserDto {
    @IsString()
    @Min(1)
    username: string;

    @IsString()
    @IsNotEmpty()
    @Min(7)
    @Max(50)
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
    @Min(7)
    @Max(50)
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

