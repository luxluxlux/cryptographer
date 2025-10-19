/**
 * Check if a value is present in an enum object
 * @param enumObj The enum object to check against
 * @param value The value to check
 * @return Returns true if the value is present in the enum object, false otherwise
 */
export function isEnumValue<T extends Record<string, string | number>>(
    enumObj: T,
    value: unknown
): value is T[keyof T] {
    return Object.values(enumObj).includes(value as T[keyof T]);
}
