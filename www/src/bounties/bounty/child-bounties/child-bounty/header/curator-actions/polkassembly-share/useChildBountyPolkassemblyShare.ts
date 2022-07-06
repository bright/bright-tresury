import { PolkassemblyPostType } from '../../../../../../../polkassembly/api/polkassembly-posts.dto'
import { usePath } from '../../../../../../../util/usePath'
import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import { ROUTE_CHILD_BOUNTY } from '../../../../../../../routes/routes'
import { Nil } from '../../../../../../../util/types'
import { ChildBountyDto } from '../../../../child-bounties.dto'

interface OwnProps {
    childBounty: ChildBountyDto
}
export type UseChildBountyPolkassemblyShareProps = OwnProps

export const useChildBountyPolkassemblyShare = ({ childBounty }: UseChildBountyPolkassemblyShareProps) => {
    const intro = useIntro(childBounty.parentBountyBlockchainIndex, childBounty.blockchainIndex)
    const description = useDescription(childBounty.description)
    return {
        postData: {
            title: childBounty.title ?? '',
            content: `${intro}${description}`,
            onChainIndex: childBounty.blockchainIndex,
            type: PolkassemblyPostType.ChildBounty,
        },
    }
}

const useIntro = (bountyIndex: number, childBountyIndex: number) => {
    const { getAbsolutePath } = usePath()
    const { t } = useTranslation()

    const url = getAbsolutePath(
        generatePath(ROUTE_CHILD_BOUNTY, {
            bountyIndex,
            childBountyIndex,
        }),
    )

    return `**${t('childBounty.polkassemblyShare.intro')} [${t('childBounty.polkassemblyShare.link')}](${url})**`
}

const useDescription = (description: Nil<string>) => {
    if (!description) return ''

    return `\n\n${description}`
}
