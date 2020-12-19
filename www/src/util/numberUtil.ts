/**
 * It formats large numbers, so that thousands are separate by commas.
 * @param value
 */
export function formatNumber(value: number): string {
    return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}
