import { httpSpec } from "../../specs/http-spec.js";
import { Generator } from "../../types/generator.js";

export type HttpSpec = ReturnType<typeof httpSpec>;
export type Generate = Generator<typeof httpSpec>["generate"];
export type GenerateContext = Parameters<Generate>[0];
