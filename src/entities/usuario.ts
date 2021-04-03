import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID, Authorized } from "type-graphql";
import { RolesTypes } from "../enums/role-types.enum";

@ObjectType()
@Entity()
export class Usuario extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Authorized()
    @Field(() => String)
    @Column("text", { nullable: true })
    name!: string;

    @Authorized([RolesTypes.ADMIN, RolesTypes.AGENTE])
    @Field(() => String)
    @Column("text", { nullable: true })
    telefono!: string;

    @Field(() => String)
    @Column("text", { nullable: true })
    email!: string;

    @Column("text", { nullable: true })
    password!: string;

    @Authorized(RolesTypes.ADMIN)
    @Field(type => RolesTypes)
    @Column("text", { nullable: true })
    role!: RolesTypes;
}