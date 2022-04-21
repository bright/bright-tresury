import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '../../../../components/divider/Divider'
import InformationTip from '../../../../components/info/InformationTip'
import { TipDto, TipStatus } from '../../../tips.dto'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
        },
        label: {
            textAlign: 'right',
            marginBottom: '8px',
        },
        info: {
            marginBottom: '16px',
        },
    }),
)

interface OwnProps {
    tip: TipDto
    closingThreshold: number
}

export type TippersCardHeaderProps = OwnProps

const TippersCardHeader = ({ tip, closingThreshold }: TippersCardHeaderProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const label = useMemo(() => {
        switch (tip.status) {
            case TipStatus.Tipped:
                return t('tip.tippers.info', { closingThreshold })
            case TipStatus.Closing:
                return t('tip.tippers.infoClosing', { closingThreshold })
            case TipStatus.PendingPayout:
                return t('tip.tippers.infoPendingPayout')
        }
    }, [tip])

    return (
        <>
            <div className={classes.root}>
                <h3 className={classes.label}>
                    {tip.tips.length}/{closingThreshold}
                </h3>
                <InformationTip className={classes.info} label={label} />
            </div>
            <Divider />
        </>
    )
}
export default TippersCardHeader
