import { SchemaType } from "../../../types/schema-type.js";
import * as goTypes from "../golang-types/types.js";
import { GenerateContext } from "../types.js";

export const getNativeType = (type: SchemaType, context: GenerateContext) =>
	// TODO: Tuple support (then we can remove the `as never` cast)
	type.getNativeType(Object.values(goTypes) as never, context);
