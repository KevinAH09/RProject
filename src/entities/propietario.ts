import { validateOrReject } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, PrimaryGeneratedColumn , BeforeInsert, Column, CreateDateColumn, Entity, BeforeUpdate} from "typeorm";
import { EntityStates } from "../enums/entity-states.enum";

@ObjectType()
@Entity()
export class Propietario extends BaseEntity {
     
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    nombre!:string;
    
    @Field()
    @Column()
    telefono!:string;

    @Field()
    @Column()
    correo!:string;



    // @OneToMany(type => Family, family => family.childhood)
    // @Field({ type: () => [Family] })
    // family: Family[];

    // @ManyToOne(type => Childhood, childhood => childhood.family)
    // @Field({type: () => Childhood})
    // childhood(): Childhood {
    //     return Childhood.findOneById(1);
    // };

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    updateAt!: string


    @Field(() => EntityStates)
    @Column()
    state!: EntityStates
    
    @BeforeInsert()
    async beforeInsert() {
        this.createdAt = new Date().valueOf().toString()
        this.state = EntityStates.ACTIVE
        await validateOrReject(this)
    }

   
    

    @BeforeUpdate()
    async beforeUpdate() {
        this.updateAt = new Date().valueOf().toString()
        await validateOrReject(this)
    }
}