export type Nil<T> = T | null | undefined
type BrandedType<T, BrandId> = T & { __type: BrandId }
export type NetworkPlanckValue = BrandedType<string, 'NetworkPlanckValue'>
export type NetworkDisplayValue = BrandedType<string, 'NetworkDisplayValue'>

export interface AccountInfo {
    address: string
    display?: string
    email?: string
    legal?: string
    riot?: string
    twitter?: string
    web?: string
}
