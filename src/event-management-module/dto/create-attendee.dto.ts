import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class CreateAttendeeDto {
    @ApiProperty({ required: true })
    name: string;

    @ApiProperty({ required: true })
    @IsEmail()
    email: string;
}
