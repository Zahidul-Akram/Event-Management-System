import { ApiProperty } from "@nestjs/swagger";

export class CreateEventDto {
    @ApiProperty({ required: true })
    name: string;

    @ApiProperty({ required: false })
    description: string;

    @ApiProperty({ required: true })
    date: Date;

    @ApiProperty({ required: false })
    location: string;

    @ApiProperty({ required: true })
    max_attendees: number;
}
