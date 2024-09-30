import { Color, Prisma } from "@prisma/client";
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, isURL, IsUrl, Max, MaxLength, Min, MinLength, ValidateIf } from "class-validator";

export class UserDto {
    @IsString()
    @MinLength(1)
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
    @MinLength(1)
    username: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @ValidateIf(value => {
        return Boolean(value.picUrl)
    })
    @IsString()
    @IsUrl({
        require_protocol: false,
        allow_protocol_relative_urls: false,
        allow_underscores: true, 
        require_tld: false
    })
    picUrl?: string;

    @IsOptional()
    @IsEnum(Color)
    picColor?: Color;
}

export class AllUsersDto {
    @IsArray()
    @IsOptional()
    arrId: string[]
}
