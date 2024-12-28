import { ApiProperty } from "@nestjs/swagger";

export class RegisterAttendeeDto {
    @ApiProperty({ required: true })
    event_id: string;

    @ApiProperty({ required: true })
    attendee_id: string;
}
