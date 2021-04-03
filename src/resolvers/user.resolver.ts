import {
    Resolver,
    Query,
    Mutation,
    Arg,
    ObjectType,
    UseMiddleware,
    Field,
    Ctx,
    Int,
    InputType,
    Authorized
} from "type-graphql";
import { hash, compare } from "bcryptjs";
import { Usuario} from "../entities/usuario";

import enviroment from "../config/enviroments.config";
import { sign } from "jsonwebtoken";

import { isAuthenticated } from "../middleware/is-authenticated";
import { Context } from "../interfaces/context.interface";
import { RolesTypes } from "../entities/usuario"

@ObjectType()
class LoginResponse {
    @Field()
    accessToken?: string;
}

@InputType({ description: "Editable user information" })
class UsuarioInput {
    @Field({ nullable: true })
    name?: string

    @Field()
    notes!: string;

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

        return `Your user id : ${usuario!.id}`;
    }

    @Mutation(() => Boolean)
    async Register(
        @Arg("name") name: string,
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        const hashedPassword = await hash(password, 13);
        try {
            await Usuario.insert({
                name,
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
        const user = await Usuario.findOne({ where: { email } });

        if (!user) {
            throw new Error("Could not find user");
        }

        const verify = await compare(password, user.password);

        if (!verify) {
            throw new Error("Bad password");
        }

        return {
            accessToken: sign({ user: user }, enviroment.jwtSecretKey, {
                expiresIn: "10h"
            })
        };
    }
}