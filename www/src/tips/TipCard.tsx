import { TipDto } from './tips.dto'
import NetworkCard from '../components/network/NetworkCard'
import { useTranslation } from 'react-i18next'
import CardHeader from '../components/card/components/CardHeader'
import Divider from '../components/divider/Divider'
import React, { useMemo } from 'react'
import CardDetails from '../components/card/components/CardDetails'
import CardTitle from '../components/card/components/CardTitle'
import CardFooter from '../components/card/components/CardFooter'
import User from '../components/user/User'
import { makeStyles } from '@material-ui/core'

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
        [tip],
    )
    return (
        <NetworkCard redirectTo={undefined}>
            <CardHeader className={classes.flexEnd}>
                <div className={classes.tippers}>{tippers}</div>
            </CardHeader>

            <Divider />

            <CardDetails>
                <CardTitle title={tip.title ?? tip.polkassembly?.title ?? tip.reason} />
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
