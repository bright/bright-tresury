import BN from "bn.js";

export const BN_TEN = new BN(10)

export const transformBalance = (balance: string | BN, decimals: number, base: number | 'hex' = 'hex'): number => {
    if (typeof balance === 'string') {
        balance = new BN(balance, base)
    }
    const decimalsBN = BN_TEN.pow(new BN(decimals))

    const fractionalPart = balance.mod(decimalsBN).toNumber() / Math.pow(10, decimals)
    const integerPart = balance.div(decimalsBN).toNumber()
    return integerPart + fractionalPart
}
