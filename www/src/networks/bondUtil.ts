export function calculateBondValue(networkValue: number, bondPercent: number, bondMinValue: number): number {
    const bondValue = (networkValue * bondPercent) / 100
    return Math.max(bondMinValue, bondValue)
}
