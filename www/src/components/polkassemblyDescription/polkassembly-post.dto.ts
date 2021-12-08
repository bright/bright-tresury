export interface PolkassemblyPostDto {
    blockchainIndex: number
    title: string
    content: string
    events: PolkassemblyPostEventDto[]
}

export interface PolkassemblyPostEventDto {
    eventName: string | EventName
    blockNumber: number
    blockDateTime: string
}

export enum EventName {
    BountyExtended = 'BountyExtended',
    BountyStatus = 'BountyStatus',
}
