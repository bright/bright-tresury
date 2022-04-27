import { makeStyles } from '@material-ui/core'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import CardDetails from '../../components/card/components/CardDetails'
import CardFooter from '../../components/card/components/CardFooter'
import CardHeader from '../../components/card/components/CardHeader'
import CardTitle from '../../components/card/components/CardTitle'
import Divider from '../../components/divider/Divider'
import NetworkCard from '../../components/network/NetworkCard'
import User from '../../components/user/User'
import { ROUTE_TIP } from '../../routes/routes'
import { TipContentType } from '../tip/Tip'
import { TipDto } from '../tips.dto'
import TipValue from './TipValue'

const useStyles = makeStyles(() => ({
    flexEnd: {
        justifyContent: 'flex-end',
    },
    tippers: {
        fontSize: '14px',
    },
}))

interface OwnProps {
    item: TipDto
}

export type TipCardProps = OwnProps

const TipCard = ({ item: tip }: TipCardProps) => {
    const { t } = useTranslation()
    const classes = useStyles()
    const tippers = useMemo(
        () => `${tip.tips.length} ${tip.tips.length === 1 ? t('tip.list.tipper') : t('tip.list.tippers')}`,
        [tip, t],
    )

    const redirectTo = `${generatePath(ROUTE_TIP, { tipHash: tip.hash })}/${TipContentType.Info}`

    return (
        <NetworkCard redirectTo={redirectTo}>
            <CardHeader className={classes.flexEnd}>
                <div className={classes.tippers}>{tippers}</div>
            </CardHeader>

            <Divider />

            <CardDetails>
                <CardTitle title={tip.title ?? tip.polkassembly?.title ?? tip.reason} />
                {tip.tips.length ? <TipValue tip={tip} /> : null}
            </CardDetails>

            <Divider />

            <CardFooter>
                <User label={t('tip.list.finder')} user={tip.finder} />
                <User label={t('tip.list.beneficiary')} user={tip.beneficiary} />
            </CardFooter>
        </NetworkCard>
    )
}
export default TipCard
