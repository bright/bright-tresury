export function arrayToMap(array: any[], key: string) {
    return new Map(array.map((element) => [element[key], element]))
}
export function keysAsArray<K, V>(map: Map<K, V>): K[] {
    return Array.from(map.keys())
}
export function valuesAsArray<K, V>(map: Map<K, V>): V[] {
    return Array.from(map.values())
}
