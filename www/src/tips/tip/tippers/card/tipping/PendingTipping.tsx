import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import User from '../../../../../components/user/User'
import { PublicUserDto } from '../../../../../util/publicUser.dto'
import { TipStatus } from '../../../../tips.dto'
import TippingContainer from './TippingContainer'

const useStyles = makeStyles(() =>
    createStyles({
        pending: {
            marginRight: '6px',
        },
    }),
)

interface OwnProps {
    tipper: PublicUserDto
    tipStatus: TipStatus
}

export type TippingProps = OwnProps

const Tipping = ({ tipper, tipStatus }: TippingProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const label = tipStatus === TipStatus.PendingPayout ? t('tip.tippers.noTip') : t('tip.tippers.pending')

    return (
        <TippingContainer>
            <User user={tipper} />
            <p className={classes.pending}>{label}</p>
        </TippingContainer>
    )
}

export default Tipping
