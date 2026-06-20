import Ajv from "ajv";
import addFormats from "ajv-formats";
import { readFileSync } from "fs";

const ajv = new Ajv();
addFormats(ajv);

const schema = JSON.parse(readFileSync("schemas/redirects.schema.json", "utf8"));
const data = JSON.parse(readFileSync("public/redirects.json", "utf8"));

const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
  console.error("public/redirects.json is invalid:");
  console.error(ajv.errorsText(validate.errors));
  process.exit(1);
}

console.log("public/redirects.json valid");
