import { apiGet } from '../api'
import { useQuery, UseQueryOptions } from 'react-query'
import { Network } from './networks.dto'

const NETWORKS_API_PATH = '/configuration/blockchains'

function getNetworks() {
    return apiGet<Network[]>(`${NETWORKS_API_PATH}`)
}

export const useGetNetworks = (options?: UseQueryOptions<Network[]>) => {
    return useQuery<Network[]>(['networks'], () => getNetworks(), options)
}
