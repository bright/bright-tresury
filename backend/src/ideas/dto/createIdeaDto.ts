interface CreateIdeaDto {
    title: string
    networks?: CreateIdeNetworkDto[]
}

interface CreateIdeNetworkDto {
    name: string
    value?: number
}