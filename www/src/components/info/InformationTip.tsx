import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import informationSvg from '../../assets/Information_icon.svg'
import { ClassNameProps } from '../props/className.props'
import clsx from 'clsx'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        informationIcon: {
            marginRight: '10px',
            height: '17px',
            width: '17px',
        },
    }),
)

interface OwnProps {
    label: ReactNode
}

export type InformationTipProps = OwnProps & ClassNameProps

const InformationTip = ({ label, className }: InformationTipProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={clsx(classes.root, className)}>
            <img src={informationSvg} className={classes.informationIcon} alt={t('components.informationIcon')} />
            <span>{label}</span>
        </div>
    )
}

export default InformationTip
