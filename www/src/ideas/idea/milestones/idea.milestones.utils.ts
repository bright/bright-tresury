import { IdeaMilestoneNetworkDto } from './idea.milestones.dto'
import { Network } from '../../../networks/networks.dto'

export const isSameNetwork = (ideaMilestoneNetworkDto: IdeaMilestoneNetworkDto, network: Network) =>
    ideaMilestoneNetworkDto.name === network.id

export const findNetwork = (ideaMilestoneNetworkDto: IdeaMilestoneNetworkDto, networks: Network[]) =>
    networks.find((network) => isSameNetwork(ideaMilestoneNetworkDto, network))

export const findIdeaMilestoneNetwork = (ideaMilestoneNetworkDtos: IdeaMilestoneNetworkDto[], network: Network) =>
    ideaMilestoneNetworkDtos.find((ideaMilestoneNetworkDto) => isSameNetwork(ideaMilestoneNetworkDto, network))
