import { validateOrReject } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, PrimaryGeneratedColumn , BeforeInsert, Column, CreateDateColumn, Entity} from "typeorm";
import { EntityStates } from "../enums/entity-states.enum";

@ObjectType()
@Entity()
class Foto extends BaseEntity {
     
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    tags!:string;
    
    @Field()
    @Column()
    base64!:string;



    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string

    @Field(() => EntityStates)
    @Column()
    state!: EntityStates
    
    @BeforeInsert()
    async beforeInsert() {
        this.createdAt = new Date().valueOf().toString()
        this.state = EntityStates.ACTIVE
        await validateOrReject(this)
    }

}

 
