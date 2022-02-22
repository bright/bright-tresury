import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import { PolkassemblyPostDto, PolkassemblyPostType } from '../../../../../polkassembly/api/polkassembly-posts.dto'
import { ROUTE_BOUNTY } from '../../../../../routes/routes'
import { Nil } from '../../../../../util/types'
import { usePath } from '../../../../../util/usePath'
import { BountyDto } from '../../../../bounties.dto'

export interface UseBountyPolkassemblyShareResult {
    postData: PolkassemblyPostDto
}

interface OwnProps {
    bounty: BountyDto
}

export type UseBountyPolkassemblyShareProps = OwnProps

export const useBountyPolkassemblyShare = ({
    bounty,
}: UseBountyPolkassemblyShareProps): UseBountyPolkassemblyShareResult => {
    const intro = useIntro(bounty.blockchainIndex)
    const description = useDescription(bounty.description)
    return {
        postData: {
            title: bounty.title ?? '',
            content: `${intro}${description}`,
            onChainIndex: bounty.blockchainIndex,
            type: PolkassemblyPostType.Bounty,
        },
    }
}

const useIntro = (bountyIndex: number) => {
    const { getAbsolutePath } = usePath()
    const { t } = useTranslation()

    const url = getAbsolutePath(
        generatePath(ROUTE_BOUNTY, {
            bountyIndex,
        }),
    )

    return `**${t('bounty.info.curatorActions.polkassemblyShare.intro')} [${t(
        'bounty.info.curatorActions.polkassemblyShare.link',
    )}](${url})**`
}

const useDescription = (description: Nil<string>) => {
    const { t } = useTranslation()
    if (!description) {
        return ''
    }
    return `\n\n${description}`
}
