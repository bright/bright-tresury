import {NetworkDisplayValue, NetworkPlanckValue} from "./types";


export const isValidNumber = (value: string) => {
    const VALID_NUMBER_REGEXP = /^\d+(\.\d+)?$/gm
    return VALID_NUMBER_REGEXP.test(value)
}

export const isNotNegative = (value: string) => value[0] !== '-'

export const hasPositiveDigit = (value: string) => {
    const HAS_POSITIVE_DIGIT = /[1-9]/gm
    return HAS_POSITIVE_DIGIT.test(value)
}

export const isDecimal = (value: string) => {
    const DECIMAL_REGEXP = /^\d+\.\d+$/gm
    return DECIMAL_REGEXP.test(value)
}
export const isCorrectDecimalPrecision = (value: string, decimals: number) => {
    if (!isDecimal(value)) return true
    const LEFT_AND_DOT_REGEXP = /^\d+\./gm
    return value.replace(LEFT_AND_DOT_REGEXP, '').length <= decimals
}

const padWithZeros = (count: number) => '0'.repeat(count)
const removePrecedingZeros = (text: string): string => text.replace(/^0+/gm, '')
const removeTrailingZeros = (text: string): string => text.replace(/0+$/gm, '')
export const toNetworkPlanckValue = (value: NetworkDisplayValue, decimals: number): NetworkPlanckValue | undefined => {
    // check if value is a valid number ie. contains only numbers and optional single dot somewhere in the middle
    if (!isValidNumber(value)) return
    // no need to pad with zeros if value is 0
    if(value === '0') return '0' as NetworkPlanckValue
    // if value does not contain any decimals (numbers after the dot), lets just concatenate value with enough amount of zeros
    if (!isDecimal(value)) return `${value}${'0'.repeat(decimals)}` as NetworkPlanckValue

    // only numbers on the left side of dot
    const DOT_AND_RIGHT_REGEXP = /\.\d+$/gm
    const left = value.replace(DOT_AND_RIGHT_REGEXP, '')

    // only numbers right side of dot, also truncate if numbers are more than decimals
    const LEFT_AND_DOT_REGEXP = /^\d+\./gm
    const right = value.replace(LEFT_AND_DOT_REGEXP, '').substr(0, decimals)

    const displayValue = removePrecedingZeros(`${left}${right}${padWithZeros(decimals - right.length)}`)
    // removePrecedingZeros can remove empty string if its argument is a string with just zeros
    return (displayValue === '' ? '0' : displayValue) as NetworkPlanckValue
}

export const toNetworkDisplayValue = (value: NetworkPlanckValue, decimals: number): NetworkDisplayValue => {
    if (value === '0') return '0' as NetworkDisplayValue
    if (value.length <= decimals) return `0.${removeTrailingZeros(padWithZeros(decimals - value.length) + value)}` as NetworkDisplayValue

    const prefix = value.substring(0, value.length - decimals)
    const suffix = value.substring(value.length - decimals)
    const strippedSuffix = removeTrailingZeros(suffix)

    if (!strippedSuffix.length) return prefix as NetworkDisplayValue

    return `${prefix}.${strippedSuffix}` as NetworkDisplayValue
}

export const toFixedDecimals = (value: NetworkDisplayValue, decimals: number): string => {
    if (!isDecimal(value)) return `${value}.${'0'.repeat(decimals)}`
    const LEFT_AND_DOT_REGEXP = /^\d+\./gm
    const onlyDecimals = value.replace(LEFT_AND_DOT_REGEXP, '')
    const noLonger = onlyDecimals.substr(0, decimals)
    const paddedWithZeros = `${noLonger}${padWithZeros(decimals - noLonger.length)}`

    const DOT_AND_RIGHT_REGEXP = /\.\d+$/gm
    const full = value.replace(DOT_AND_RIGHT_REGEXP, '')
    return `${full}.${paddedWithZeros}`
}
