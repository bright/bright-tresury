import config from '../config'

export function calculateBondValue(networkValue: number): number {
    const bondValue = (networkValue * config.BOND_VALUE.PERCENT) / 100
    return Math.max(config.BOND_VALUE.MIN_VALUE, bondValue)
}
