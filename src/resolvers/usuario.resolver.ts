import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import {
    Arg,






    Authorized, Ctx, Field,


    InputType, Int, Mutation,

    ObjectType, Query, Resolver,




    UseMiddleware
} from "type-graphql";
import enviroment from "../config/enviroments.config";
import { Usuario } from "../entities/usuario";
import { RolesTypes } from "../enums/role-types.enum";
import { Context } from "../interfaces/context.interface";
import { isAuthenticated } from "../middleware/is-authenticated";



@ObjectType()
class LoginResponse {
    @Field()
    accessToken?: string;
}

@InputType({ description: "Editable user information" })
class UsuarioInput {
    @Field({ nullable: true })
    nombre?: string

    @Field()
    notes!: string;

    @Field()
    telefono!: string;

    @Field(type => RolesTypes)
    role!: RolesTypes;
}


@Resolver()
export class UsuarioResolver {
    @Query(() => [Usuario])
    async users() {
        return Usuario.find();
    }
    @Authorized("ADMIN")
    @Mutation(() => Usuario)
    async updateUser(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => UsuarioInput) data: UsuarioInput
    ) {
        await Usuario.update({ id }, data);
        const dataUpdated = await Usuario.findOne(id);
        return dataUpdated;
    }

    @Query(() => String)
    @UseMiddleware(isAuthenticated)
    async Me(@Ctx() { usuario }: Context) {
        console.log(JSON.stringify(usuario));

        return `El usuario id : ${usuario!.id}`;
    }

    @Mutation(() => Boolean)
    async Register(
        @Arg("nombre") nombre: string,
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        const hashedPassword = await hash(password, 13);
        try {
            await Usuario.insert({
                nombre,
                email,
                password: hashedPassword
            });
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    }

    @Mutation(() => LoginResponse)
    async Login(@Arg("email") email: string, @Arg("password") password: string) {
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            throw new Error("No se pudo encontrar el usuario");
        }

        const verify = await compare(password, usuario.password);

        if (!verify) {
            throw new Error("Contraseña incorrecta");
        }

        return {
            accessToken: sign({ usuario: usuario }, enviroment.jwtSecretKey, {
                expiresIn: "10h"
            })
        };
    }
}