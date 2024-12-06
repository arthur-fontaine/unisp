import { SchemaType } from "../../../types/schema-type.js";
import * as typescriptTypes from "../typescript-types/types.js";
import { GenerateContext } from "../types.js";

export const getNativeType = (type: SchemaType, context: GenerateContext) =>
	type.getNativeType(Object.values(typescriptTypes), context);
