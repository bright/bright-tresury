import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import { IdeaProposalDetailsDto } from '../../../idea-proposal-details/idea-proposal-details.dto'
import { useNetworks } from '../../../networks/useNetworks'
import { PolkassemblyPostDto, PolkassemblyPostType } from '../../../polkassembly/api/polkassembly-posts.dto'
import { ROUTE_PROPOSAL } from '../../../routes/routes'
import { Nil } from '../../../util/types'
import { usePath } from '../../../util/usePath'
import { useGetProposalMilestones } from '../milestones/proposal.milestones.api'
import { ProposalContentType } from '../ProposalContentTypeTabs'

export interface UseProposalPolkassemblyShareResult {
    postData: PolkassemblyPostDto
}

interface OwnProps {
    proposalIndex: number
    details: Nil<IdeaProposalDetailsDto>
}

export type UseProposalPolkassemblyShareProps = OwnProps

export const useProposalPolkassemblyShare = ({
    proposalIndex,
    details,
}: UseProposalPolkassemblyShareProps): UseProposalPolkassemblyShareResult => {
    const intro = useIntro(proposalIndex)
    const about = useAbout(details)
    const milestones = useMilestones(proposalIndex)

    const postData = details
        ? { content: `${intro}${about}${milestones}`, title: details.title }
        : { title: '', content: '' }

    return { postData: { ...postData, onChainIndex: proposalIndex, type: PolkassemblyPostType.Proposal } }
}

const useIntro = (proposalIndex: number) => {
    const { getAbsolutePath } = usePath()
    const { t } = useTranslation()

    const url = getAbsolutePath(
        generatePath(ROUTE_PROPOSAL, {
            proposalIndex,
        }),
    )

    return `**${t('proposal.details.polkassemblyShare.intro')} [${t(
        'proposal.details.polkassemblyShare.link',
    )}](${url})**`
}

const useAbout = (details: Nil<IdeaProposalDetailsDto>) => {
    const { t } = useTranslation()
    if (!details || details.content === '') {
        return ''
    }
    return `\n\n## ${t('proposal.details.polkassemblyShare.about')}\n\n${details.content}`
}

const useMilestones = (proposalIndex: number) => {
    const { network } = useNetworks()
    const { data } = useGetProposalMilestones({ proposalIndex, network: network.id })
    const { getAbsolutePath } = usePath()
    const { t } = useTranslation()

    if (!data || !data.length) {
        return ''
    }

    const url = getAbsolutePath(
        generatePath(`${ROUTE_PROPOSAL}/${ProposalContentType.Milestones}`, {
            proposalIndex,
        }),
    )
    const milestonesTitles = data.map((milestone) => `* ${milestone.details.subject}`).join('\n')

    const content = `\n\n## ${t('proposal.details.polkassemblyShare.milestones')}\n\n${milestonesTitles}\n\n[${t(
        'proposal.details.polkassemblyShare.seeMore',
    )}](${url})`
    return content
}
