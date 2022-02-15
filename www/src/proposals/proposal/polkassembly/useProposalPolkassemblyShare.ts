import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import { IdeaProposalDetailsDto } from '../../../idea-proposal-details/idea-proposal-details.dto'
import { useNetworks } from '../../../networks/useNetworks'
import { PolkassemblyPostDto } from '../../../polkassembly/PolkassemblyShareModal'
import { ROUTE_PROPOSAL } from '../../../routes/routes'
import { usePath } from '../../../util/usePath'
import { Nil } from '../../../util/types'
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
    const milestones = useMilestones(proposalIndex)
    const intro = useIntro(proposalIndex)
    const about = useAbout(details)

    const postData = details
        ? { content: `${intro}${about}${milestones}`, title: details.title }
        : { title: '', content: '' }

    return { postData }
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

    const content = `

## ${t('proposal.details.polkassemblyShare.milestones')}

${milestonesTitles}

[${t('proposal.details.polkassemblyShare.seeMore')}](${url})`
    return content
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
    return `
## ${t('proposal.details.polkassemblyShare.about')}

${details.content}`
}
