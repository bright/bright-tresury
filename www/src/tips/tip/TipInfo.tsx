import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSuccessfullyLoadedItemStyles } from '../../components/loading/useSuccessfullyLoadedItemStyles'
import { Label } from '../../components/text/Label'
import User from '../../components/user/User'
import LongText from '../../components/text/LongText'
import { TipDto } from '../tips.dto'

const useStyles = makeStyles(() =>
    createStyles({
        addresses: {
            display: 'flex',
            rowGap: '2em',
            columnGap: '78px',
            flexWrap: 'wrap',
        },
        spacing: {
            marginTop: '2em',
        },
    }),
)

interface OwnProps {
    tip: TipDto
}

export type TipInfoProps = OwnProps

const TipInfo = ({ tip }: TipInfoProps) => {
    const classes = useStyles()
    const loadedClasses = useSuccessfullyLoadedItemStyles()
    const { t } = useTranslation()

    return (
        <div className={loadedClasses.content}>
            <div className={classes.addresses}>
                <div>
                    <Label label={t('tip.info.finder')} />
                    <User user={tip.finder} />
                </div>
                <div>
                    <Label label={t('tip.info.beneficiary')} />
                    <User user={tip.beneficiary} />
                </div>
            </div>
            <div className={classes.spacing}>
                <Label label={t('tip.info.description')} />
                <LongText text={tip.description} placeholder={t('bounty.info.description')} />
            </div>
            <div className={classes.spacing}>
                <Label label={t('tip.info.reason')} />
                <LongText text={tip.reason} placeholder={t('tip.info.reason')} />
            </div>
        </div>
    )
}

export default TipInfo
