import {Entity, Column, PrimaryGeneratedColumn,BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany} from 'typeorm';
import { ObjectType, Field, Int } from "type-graphql";
import { validateOrReject } from 'class-validator';
import { EntityStates } from '../enums/entity-states.enum';
import { Propiedad } from './propiedad';



@ObjectType()
@Entity()
export class Construccion extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(()=>[Propiedad])
    @ManyToMany(() => Propiedad, propiedad=> propiedad.servicios)
    propiedades!:Propiedad[]

    @Field(() => EntityStates)
    @Column()
    state!: EntityStates

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    updateAt!: string

    @Field(() => String)
    @Column("text", { nullable: true })
    metro_cuadrado!: number;

    @Column("text", { nullable: true })
    descripcion!: string;

    @Column("text", { nullable: true })
    bano!: string;

    @Column("text", { nullable: true })
    sala!: string;

    @Column("text", { nullable: true })
    planta!: string;

    @Column("text", { nullable: true })
    cocina!: string;

    @Column("text", { nullable: true })
    dormitorio!: string;

    @Column("text", { nullable: true })
    material!: string;

    @BeforeInsert()
    async beforeInsert() {
        this.createdAt = new Date().valueOf().toString()
        this.updateAt = this.createdAt
        this.state = EntityStates.ACTIVE
        await validateOrReject(this)
    }

    @BeforeUpdate()
    async beforeUpdate() {
        this.updateAt = new Date().valueOf().toString()
        await validateOrReject(this)
    }
    
}

