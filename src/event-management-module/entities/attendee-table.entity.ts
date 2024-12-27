import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('attendee-table')
export class AttendeeTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, unique: true })
    email : string;
}
