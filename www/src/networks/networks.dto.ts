export interface Network {
    id: string
    name: string
    url: string
    customTypes: unknown
    rpc: unknown
    developmentKeyring: boolean
    bond: {
        minValue: number
        percentage: number
    }
    currency: string
    decimals: number
    color: string
    isDefault: boolean
}
