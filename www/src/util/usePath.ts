import config from '../config'
import { useNetworks } from '../networks/useNetworks'

export interface UsePathResult {
    getAbsolutePath: (relativePath: string) => string
}

export const usePath = (): UsePathResult => {
    const { network } = useNetworks()
    const getAbsolutePath = (relativePath: string) => `${config.WEBSITE_URL}${relativePath}?network=${network.id}`
    return { getAbsolutePath }
}
