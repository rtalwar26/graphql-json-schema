import * as fs from "fs"
import * as path from "path"
import * as graphql from 'graphql';
import { GraphQLObjectType } from 'graphql'
export const getGQLType = (configPath: string, name: string, field: any): any => {
    let type = field.type;
    switch (type) {
        case 'float':
            return graphql.GraphQLFloat
        case 'string':
            return graphql.GraphQLString
        case 'integer':
            return graphql.GraphQLInt
        case 'boolean':
            return graphql.GraphQLBoolean
        case 'object':
            return new GraphQLObjectType({
                name,
                fields: getGqlFields(name, configPath, field),
                description: field.description
            });
        case 'array':
            return new graphql.GraphQLList(getGQLType(configPath, name, field.items))
    }
}
// export const buildType = (configPath: string, name: string, schema: any): GraphQLObjectType => {
//     let fields = getGqlFields(configPath, schema);
//     return new GraphQLObjectType({
//         name,
//         fields,
//         description: schema.description
//     });
// }

export const getGqlFields = (parentname: string, configPath: string, schema: any): any => {

    let fields = {};
    let properties = schema.properties;

    let isImported = typeof properties === 'string' && (properties as string).startsWith('require:');
    let fieldConfigPath = isImported ? path.join(path.dirname(configPath), properties.replace(/require:/, '').trim()) : configPath;
    let properties_data = isImported ? JSON.parse(fs.readFileSync(fieldConfigPath).toString('utf8')) : properties;
    let importedFields = {};
    for (let key in properties_data) {
        let isKeyImported = typeof key === 'string' && (key as string).startsWith('require:');
        if (isKeyImported) {
            let keyConfigPath = path.join(path.dirname(configPath), properties_data[key].replace(/require:/, '').trim())
            let propertyData = JSON.parse(fs.readFileSync(fieldConfigPath).toString('utf8'));
            importedFields = { ...importedFields, ...propertyData };
        } else {
            fields[key] = {
                type: getGQLType(fieldConfigPath, `${parentname}_${key}`, properties_data[key]),
                description: typeof properties_data[key].description === 'string' ? properties_data[key].description : JSON.stringify(properties_data[key].description)
            }
        }
    }
    properties_data = importedFields;
    for (let key in properties_data) {
        fields[key] = {
            type: getGQLType(fieldConfigPath, `${parentname}_${key}`, properties_data[key]),
            description: typeof properties_data[key].description === 'string' ? properties_data[key].description : JSON.stringify(properties_data[key].description)
        }
    }

    return fields
}
export const schema_builder = (config_path:string):graphql.GraphQLSchema=>{
    return new graphql.GraphQLSchema(schemaConfigBuilder(config_path));
}

export const schemaConfigBuilder = (p: string): any => {
    let config = JSON.parse(fs.readFileSync(p).toString('utf8'));
    let dependencies = config.dependencies;
    let configPathDir = path.dirname(p);
    let queryFields = {};
    let mutationFields = {};
    for (let d of dependencies) {
        let destinationBucket = (d.type === 'Query') ? queryFields : mutationFields
        let configPath = path.join(configPathDir, d.path);
        d.schema = JSON.parse(fs.readFileSync(configPath).toString('utf8'));

        destinationBucket[d.name] = {
            type: getGQLType(configPath, d.name, d.schema.response),
            args: getGqlFields(d.name, configPath, d.schema.request),
            description: typeof d.schema.request.description === 'string' ? d.schema.request.description : JSON.stringify(d.schema.request.description)
        }
    }

    const schemaConfig = {
        query: new GraphQLObjectType({
            name: 'Query',
            fields: {
                ...queryFields
            }
        }),
        mutation: new GraphQLObjectType({
            name: 'Mutation',
            fields: {
                ...mutationFields
            }
        })
    };
    return schemaConfig;
}