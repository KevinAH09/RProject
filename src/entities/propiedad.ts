import {Entity, Column, PrimaryGeneratedColumn,BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate, ManyToMany, OneToMany} from 'typeorm';
import { Field, Int, ObjectType} from "type-graphql";
import { validateOrReject } from 'class-validator';
import { EntityStates } from '../enums/entity-states.enum';
import { TipoServicio } from './tipo-servicio';
import { TipoBeneficio } from './tipo-beneficio';
import { Categoria } from './categoria';
import { Foto } from './foto';

@ObjectType()
@Entity()
export class Propiedad extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn()
    id!:number;
   
    @Field()
    @Column()
    name!:string;


    @Field(()=>[TipoServicio])
    @ManyToMany(() => TipoServicio, servicio=> servicio.propiedades)
    servicios!:TipoServicio[]

    @Field(()=>[TipoBeneficio])
    @ManyToMany(() => TipoBeneficio, beneficio=> beneficio.propiedades)
    beneficios!:TipoBeneficio[]

    @Field(()=>[Categoria])
    @ManyToMany(() => Categoria, categoria=> categoria.propiedades)
    categorias!:Categoria[]

    @Field(() => [Foto] )
    @OneToMany(() => Foto, foto => foto.propiedad)
    fotos!: Foto[];

    @Field(() => EntityStates)
    @Column()
    state!: EntityStates

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    updateAt!: string

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