import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import NoMotion from '../../../components/voting/NoMotion'
import { ROUTE_TIP } from '../../../routes/routes'
import { TipContentType } from '../Tip'

export interface NoTippersProps {
    tipHash: string
}

const NoTippers = ({ tipHash }: NoTippersProps) => {
    const { t } = useTranslation()

    const toDiscussionLink = `${generatePath(ROUTE_TIP, { tipHash })}/${TipContentType.Discussion}`

    return (
        <NoMotion
            title={t('tip.tippers.noTippers.title')}
            description={t('tip.tippers.noTippers.description')}
            toDiscussion={toDiscussionLink}
        />
    )
}

export default NoTippers
