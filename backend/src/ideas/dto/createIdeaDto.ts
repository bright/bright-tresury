interface CreateIdeaDto {
    title: string
    networks?: CreateIdeNetworkDto[]
    beneficiary?: string
    content?: string
}

interface CreateIdeNetworkDto {
    name: string
    value?: number
}