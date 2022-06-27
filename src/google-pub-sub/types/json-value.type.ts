type JsonObject = { [Key in string]?: JsonValue };
type JsonArray = Array<string | number | boolean | JsonObject>;
export type JsonValue =
  | string
  | number
  | boolean
  | JsonObject
  | JsonArray
  | undefined
  | null;
