import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Divider from '../../../../components/divider/Divider'
import InformationTip from '../../../../components/info/InformationTip'
import { TipDto } from '../../../tips.dto'

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

const TippersCardHeader = ({ tip: { tips }, closingThreshold }: TippersCardHeaderProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <>
            <div className={classes.root}>
                <h3 className={classes.label}>
                    {tips.length}/{closingThreshold}
                </h3>
                <InformationTip className={classes.info} label={t('tip.tippers.info', { closingThreshold })} />
            </div>
            <Divider />
        </>
    )
}
export default TippersCardHeader
