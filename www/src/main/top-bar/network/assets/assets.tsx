import { NetworkNameVariant } from '../NetworkName'
import polkadotLight from './polkadot_light.svg'
import polkadotDark from './polkadot_dark.svg'
import kusamaLight from './kusama_light.svg'
import kusamaDark from './kusama_dark.svg'

interface Logos {
    dark: string
    light: string
}

const PolkadotLogos = {
    light: polkadotLight,
    dark: polkadotDark,
} as Logos

const KusamaLogos = {
    light: kusamaLight,
    dark: kusamaDark,
} as Logos

export function getNetworkLogo(variant: NetworkNameVariant, id: string): string | undefined {
    switch (id) {
        case 'polkadot':
            return PolkadotLogos[variant]
        case 'kusama':
            return KusamaLogos[variant]
        default:
            return undefined
    }
}
