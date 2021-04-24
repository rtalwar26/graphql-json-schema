var fs = require("fs");
var path = require("path");
var graphql = require("graphql");
var graphql_1 = require("graphql");
exports.getGQLType = function (configPath, name, field, isInput) {
    if (isInput === void 0) { isInput = false; }
    var type = field.type;
    var isRequired = field.required;
    var gql_field = (function () {
        switch (type) {
            case "number":
            case "float":
                return graphql.GraphQLFloat;
            case "string":
                return graphql.GraphQLString;
            case "integer":
            case "int":
                return graphql.GraphQLInt;
            case "boolean":
                return graphql.GraphQLBoolean;
            case "object":
                var o = {
                    name: name,
                    fields: exports.getGqlFields(name, configPath, field, isInput),
                    description: field.description
                };
                return isInput
                    ? new graphql_1.GraphQLInputObjectType(o)
                    : new graphql_1.GraphQLObjectType(o);
            case "array":
                return new graphql.GraphQLList(exports.getGQLType(configPath, name, field.items, isInput));
            default:
                console.error({ type: type, configPath: configPath, name: name, field: field });
                throw new Error("graphql-json-schema: Unsupported type " + type);
        }
    })();
    return isRequired ? new graphql_1.GraphQLNonNull(gql_field) : gql_field;
};
// export const buildType = (configPath: string, name: string, schema: any): GraphQLObjectType => {
//     let fields = getGqlFields(configPath, schema);
//     return new GraphQLObjectType({
//         name,
//         fields,
//         description: schema.description
//     });
// }
exports.getGqlFields = function (parentname, configPath, schema, isInput) {
    if (isInput === void 0) { isInput = false; }
    var fields = {};
    var properties = schema.properties;
    var isImported = typeof properties === "string" &&
        (properties), as = string, startsWith = ("require:");
    var fieldConfigPath = isImported
        ? path.join(path.dirname(configPath), properties.replace(/require:/, "").trim())
        : configPath;
    var properties_data = isImported
        ? JSON.parse(fs.readFileSync(fieldConfigPath).toString("utf8"))
        : properties;
    var importedFields = {};
    for (var key in properties_data) {
        var isKeyImported = typeof key === "string" && (key), as_1 = string, startsWith_1 = ("require:");
        if (isKeyImported) {
            // let keyConfigPath = path.join(path.dirname(configPath), properties_data[key].replace(/require:/, '').trim())
            var propertyData = JSON.parse(fs.readFileSync(fieldConfigPath).toString("utf8"));
            importedFields = { importedFields: importedFields, propertyData: propertyData };
        }
        else {
            fields[key] = {
                type: exports.getGQLType(fieldConfigPath, parentname + "_" + key, properties_data[key], isInput),
                description: typeof properties_data[key].description === "string"
                    ? properties_data[key].description
                    : JSON.stringify(properties_data[key].description)
            };
        }
    }
    properties_data = importedFields;
    for (var key in properties_data) {
        fields[key] = {
            type: exports.getGQLType(fieldConfigPath, parentname + "_" + key, properties_data[key], isInput),
            description: typeof properties_data[key].description === "string"
                ? properties_data[key].description
                : JSON.stringify(properties_data[key].description)
        };
    }
    return fields;
};
exports.schema_builder = function (config_path) {
    return new graphql.GraphQLSchema(exports.schemaConfigBuilder(config_path));
};
exports.schemaConfigBuilder = function (p) {
    var config = JSON.parse(fs.readFileSync(p).toString("utf8"));
    var dependencies = config.dependencies;
    var configPathDir = path.dirname(p);
    var queryFields = {};
    var mutationFields = {};
    for (var _i = 0; _i < dependencies.length; _i++) {
        var d = dependencies[_i];
        var destinationBucket = d.type === "Query" ? queryFields : mutationFields;
        var configPath = path.join(configPathDir, d.path);
        d.schema = JSON.parse(fs.readFileSync(configPath).toString("utf8"));
        destinationBucket[d.name] = {
            type: exports.getGQLType(configPath, "response_" + d.name, d.schema.response, false),
            args: exports.getGqlFields(d.name, configPath, d.schema.request, true),
            description: typeof d.schema.request.description === "string"
                ? d.schema.request.description
                : JSON.stringify(d.schema.request.description)
        };
    }
    var schemaConfig = {
        query: new graphql_1.GraphQLObjectType({
            name: "Query",
            fields: {} }, ...queryFields)
    };
}, exports.mutation = ({
    name: "Mutation",
    fields: {} });
mutationFields,
;
;
return schemaConfig;
;
