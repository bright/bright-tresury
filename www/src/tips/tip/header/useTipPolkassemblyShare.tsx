import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import { PolkassemblyPostDto, PolkassemblyPostType } from '../../../polkassembly/api/polkassembly-posts.dto'
import { TipDto } from '../../tips.dto'
import { usePath } from '../../../util/usePath'
import { ROUTE_TIP } from '../../../routes/routes'
import { Nil } from '../../../util/types'

export interface UseTipPolkassemblyShareResult {
    postData: PolkassemblyPostDto
}

interface OwnProps {
    tip: TipDto
}

export type UseTipPolkassemblyShareProps = OwnProps

export const useTipPolkassemblyShare = ({ tip }: UseTipPolkassemblyShareProps): UseTipPolkassemblyShareResult => {
    const intro = useIntro(tip.hash)
    const description = useDescription(tip.description)
    return {
        postData: {
            title: tip.title ?? tip.reason ?? '',
            content: `${intro}${description}`,
            onChainIndex: tip.hash,
            type: PolkassemblyPostType.Tip,
        },
    }
}

const useIntro = (hash: string) => {
    const { getAbsolutePath } = usePath()
    const { t } = useTranslation()

    const url = getAbsolutePath(
        generatePath(ROUTE_TIP, {
            tipHash: hash,
        }),
    )

    return `**${t('tip.polkassemblyShare.intro')} [${t('tip.polkassemblyShare.link')}](${url})**`
}

const useDescription = (description: Nil<string>) => {
    if (!description) return ''

    return `\n\n${description}`
}
