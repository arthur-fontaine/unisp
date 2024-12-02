import { SchemaType } from "../../../types/schema-type.js";
import * as pythonTypes from "../python-types/types.js";
import { GenerateContext } from "../types.js";

export const getNativeType = (type: SchemaType, context: GenerateContext) =>
	type.getNativeType(Object.values(pythonTypes), context);
