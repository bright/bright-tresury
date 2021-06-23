import { apiGet } from '../api'
import { useQuery, UseQueryOptions } from 'react-query'
import { Network } from './networks.dto'

const NETWORKS_API_PATH = '/networks'

function getNetworks() {
    // TODO use the actual endpoint once it's ready
    // return apiGet<NetworkDto[]>(`${NETWORKS_API_PATH}`)

    const local = {
        id: 'development',
        name: 'Development',
        url: 'wss://stage.treasury.brightinventions.pl:9944',
        customTypes: {
            Address: 'MultiAddress',
            LookupSource: 'MultiAddress',
        },
        rpc: {},
        developmentKeyring: true,
        bond: {
            minValue: 1000,
            percentage: 5,
        },
        currency: 'Unit',
        decimals: 12,
        color: '#0E65F2',
        isDefault: false,
    } as Network

    const polkadot = {
        id: 'polkadot',
        name: 'Polkadot',
        url: 'wss://rpc.polkadot.io',
        customTypes: {
            Address: 'MultiAddress',
            LookupSource: 'MultiAddress',
        },
        rpc: {},
        developmentKeyring: false,
        bond: {
            minValue: 1000,
            percentage: 5,
        },
        currency: 'DOT',
        decimals: 12,
        color: '#E6007A',
        isDefault: true,
    } as Network

    const kusama = {
        id: 'kusama',
        name: 'Kusama',
        url: 'wss://kusama-rpc.polkadot.io',
        customTypes: {
            Address: 'MultiAddress',
            LookupSource: 'MultiAddress',
        },
        rpc: {},
        developmentKeyring: false,
        bond: {
            minValue: 1000,
            percentage: 5,
        },
        currency: 'KSM',
        decimals: 15,
        color: '#000000',
        isDefault: false,
    } as Network
    return Promise.resolve([polkadot, kusama, local])
}

export const useGetNetworks = (options?: UseQueryOptions<Network[]>) => {
    return useQuery<Network[]>(['networks'], () => getNetworks(), options)
}
