import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventTable } from "./event-table.entity";
import { AttendeeTable } from "./attendee-table.entity";

@Entity('registration_table')
export class RegistrationTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => EventTable, (event) => event.id, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'event_id' })
    event: EventTable;

    @ManyToOne(() => AttendeeTable, (attendee) => attendee.id, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'attendee_id' })
    attendee: AttendeeTable;
  
    @CreateDateColumn({ name: 'registered_at' })
    'registered_at': Date;
  }