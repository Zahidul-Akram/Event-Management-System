import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventDto {
    @ApiProperty({ required: false })
    name: string;

    @ApiProperty({ required: false })
    description: string;

    @ApiProperty({ required: false })
    date: Date;

    @ApiProperty({ required: false })
    location: string;

    @ApiProperty({ required: false })
    max_attendees: number;
}
