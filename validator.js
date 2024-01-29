const jsYaml = require("js-yaml");
const fs = require('fs')
const { OpenApiValidator } = require("express-openapi-validate");
const openApiDocument = jsYaml.load(
    fs.readFileSync("./swagger.yaml", "utf-8")
  );

const validator = new OpenApiValidator(openApiDocument,
    {
        ajvOptions: {
            allErrors: true,
            removeAdditional: "all",
        }
      }
    );

module.exports = validator;
