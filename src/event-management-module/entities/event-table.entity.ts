import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('event_table')
export class EventTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description : string;

    @Column({ nullable: false })
    date : Date;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: false })
    max_attendees : number;

    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;
}
