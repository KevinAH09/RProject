import { Arg, Authorized, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Int } from "type-graphql";

import { Subcategoria } from "../entities/subcategoria";
import { RolesTypes } from "../enums/role-types.enum";

@InputType()
class SubcategoriaInput {
    @Field()
    nombre!: string
    
}

@Resolver()
export class SubcategoriaResolver {
    @Authorized()
    @Mutation(() => Subcategoria)
    async createTipoServicio(
        @Arg("data", () => SubcategoriaInput) data: SubcategoriaInput
    ) {
        const newData = Subcategoria.create(data);
        return await newData.save();
    }

    @Authorized()
    @Mutation(() => Subcategoria)
    async updateTipoServicio(
        @Arg("id", () => Int) id: number,
        @Arg("data", () => SubcategoriaInput) data: SubcategoriaInput
    ) {
        await Subcategoria.update({ id }, data);
        const dataUpdated = await Subcategoria.findOne(id)
        return dataUpdated;
    }

    @Authorized(RolesTypes.ADMIN)
    @Mutation(() => Boolean)
    async deleteTipoServicio(
        @Arg("id", () => Int) id: number
    ) {
        await Subcategoria.delete(id);
        return true;
    }

    @Query(() => [Subcategoria])
    TipoServicios() {
        return Subcategoria.find()
    }

    @Query(() => [Subcategoria])
    TipoServicioById(
        @Arg("id", () => Int) id: number
    ) {
        return Subcategoria.findOne(
            {
                where: {
                    id
                }
            }
        );
    }
}