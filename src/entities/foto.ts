import { validateOrReject } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, PrimaryGeneratedColumn , BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne} from "typeorm";
import { EntityStates } from "../enums/entity-states.enum";
import { Propiedad } from "./propiedad";
import { Propietario } from "./propietario";

@ObjectType()
@Entity()
export class Foto extends BaseEntity {
     
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    tag!:string;
    
    @Field()
    @Column()
    base64!:string;

    @ManyToOne(()=> Propiedad, propiedad => propiedad.fotos)
    @Field(()=>Propiedad)
    propiedad!: Propiedad;

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

 
