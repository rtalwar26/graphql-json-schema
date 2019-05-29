# Install

```shell
npm install @cuterajat26/graphql-json-schema --save
```

# Usage


```javascript

const graphql = require("graphql");
import { schemaConfigBuilder } from '@cuterajat26/graphql-json-schema';
const schemaConfigBuilder = require("@cuterajat26/graphql-json-schema").schemaConfigBuilder;

let schemaConfig = schemaConfigBuilder(require.resolve('./relative-path-to-config-dir/config.json'));
let schema = new graphql.GraphQLSchema(schemaConfig);

```

## Config.json  format

```javascript
{
    "dependencies": [
        {
            "name": "query_operation_1",
            "path": "./query_operation_1.json",
            "type": "Query"
        },
        {
            "name": "mutation_operation_1",
            "path": "./gql/mutation_operation_1.json",
            "type": "Mutation"
        }
    ]
    }
        

```

## Operation json format

### Example query_operation_1.json

```javascript
{
    "request": {
        "type": "object",
        "properties": {
            "example_boolean_field": {
                "description": "lorem ipsum detor laga tiki taka",
                "type": "boolean"
            },
            "example_float_field": {
                "description": "lorem ipsum detor laga tiki taka",
                "type": "float"
            },
            
            "example_string_field": {
                "description": "lorem ipsum detor laga tiki taka",
                "type": "string"
            }
            
        },        
        "description": "lorem ipsum detor laga tiki taka"
    },
    "response": {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
            "example_boolean_field": {
                "description": "lorem ipsum detor laga tiki taka",
                "type": "boolean"
            },
            "example_float_field": {
                "description": "lorem ipsum detor laga tiki taka",
                "type": "float"
            },
            
            "example_string_field": {
                "description": "lorem ipsum detor laga tiki taka",
                "type": "string"
            }
            }
        }
    }
    
}
```

### Example mutation_operation_1.json

```javascript
{
    "request": {
        "type": "object",
        "properties": {
            "example_boolean_field": {
                "description": "lorem ipsum detor laga tiki taka",
                "type": "boolean"
            },
            "example_float_field": {
                "description": "lorem ipsum detor laga tiki taka",
                "type": "float"
            },
            
            "example_string_field": {
                "description": "lorem ipsum detor laga tiki taka",
                "type": "string"
            }
            
        },        
        "description": "lorem ipsum detor laga tiki taka"
    },
      "response": {
        "type": "object",
        "properties": {
           "example_boolean_field": {
                "description": "lorem ipsum detor laga tiki taka",
                "type": "boolean"
            },
            "example_float_field": {
                "description": "lorem ipsum detor laga tiki taka",
                "type": "float"
            },
            
            "example_string_field": {
                "description": "lorem ipsum detor laga tiki taka",
                "type": "string"
            },
            "_id":{
                "description":" newly created object _id",
                "type":"string"
            }
        }
    }
    
}
```