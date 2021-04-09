import { validateOrReject } from "class-validator";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@ObjectType()
@Entity()
export class Localizacion extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    // @Field(()=>[Propiedad])
    // @ManyToMany(() => Propiedad, propiedad=> propiedad.servicios)
    // propiedades!:Propiedad[]

    // @ManyToOne(()=> TipoConstruccion, tipoConstruccion => tipoConstruccion.construcciones)
    // @Field(()=>TipoConstruccion)
    // tipoConstruccion!: TipoConstruccion;


    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string

    @Field()
    @Column("text", { nullable: true })
    pais!: string;


    @BeforeInsert()
    async beforeInsert() {
        this.createdAt = new Date().valueOf().toString()
        await validateOrReject(this)
    }
    
}

