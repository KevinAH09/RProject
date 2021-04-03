import express from 'express'
import { ApolloServer } from 'apollo-server-express'

import { buildSchema } from "type-graphql"

import { PingResolver } from "./resolvers/ping.resolver";
import { TipoServicioResolver } from "./resolvers/tipo-servicio.resolver";
import { TipoBeneficioResolver } from "./resolvers/tipo-beneficio.resolver";
import { UsuarioResolver } from './resolvers/usuario.resolver';
import { isAuthorizated } from "./middleware/is-authorizated";
export async function startServer() {
    const app = express();
    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PingResolver, TipoServicioResolver, TipoBeneficioResolver,UsuarioResolver],
            authChecker: isAuthorizated
        }),
        context: ({ req, res }) => ({ req, res }),

    });
    server.applyMiddleware({ app, path: '/graphql' });
    return app;
}


