import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSuccessfullyLoadedItemStyles } from '../../../../components/loading/useSuccessfullyLoadedItemStyles'
import { Label } from '../../../../components/text/Label'
import ShortText from '../../../../components/text/ShortText'
import User from '../../../../components/user/User'
import { ChildBountyDto } from '../child-bounties.dto'
import { UserStatus } from '../../../../auth/AuthContext'
import LongText from '../../../../components/text/LongText'

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
    childBounty: ChildBountyDto
}

export type ChildBountyDetailsProps = OwnProps

const ChildBountyInfo = ({ childBounty }: ChildBountyDetailsProps) => {
    const classes = useStyles()
    const loadedClasses = useSuccessfullyLoadedItemStyles()
    const { t } = useTranslation()

    return (
        <div className={loadedClasses.content}>
            <div className={classes.addresses}>
                <div>
                    <Label label={t('childBounty.info.beneficiary')} />
                    <User user={{ web3address: childBounty.beneficiary, status: UserStatus.Web3Only }} />
                </div>
                <div>
                    <Label label={t('childBounty.info.curator')} />
                    <User user={{ web3address: childBounty.curator, status: UserStatus.Web3Only }} />
                </div>
            </div>
            <div className={classes.spacing}>
                <Label label={t('bounty.info.description')} />
                <LongText text={childBounty.description} placeholder={t('childBounty.info.description')} />
            </div>
            <div className={classes.spacing}>
                <Label label={t('childBounty.info.onChainDescription')} />
                <ShortText
                    text={childBounty.blockchainDescription}
                    placeholder={t('childBounty.info.onChainDescription')}
                />
            </div>
        </div>
    )
}

export default ChildBountyInfo
