import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSuccessfullyLoadedItemStyles } from '../../../../../components/loading/useSuccessfullyLoadedItemStyles'
import { Label } from '../../../../../components/text/Label'
import ShortText from '../../../../../components/text/ShortText'
import User from '../../../../../components/user/User'
import { ChildBountyDto } from '../../child-bounties.dto'
import LongText from '../../../../../components/text/LongText'
import PolkassemblyDescription from '../../../../../components/polkassemblyDescription/PolkassemblyDescription'

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
                {childBounty.beneficiary ? (
                    <div>
                        <Label label={t('childBounty.info.beneficiary')} />
                        <User user={childBounty.beneficiary} />
                    </div>
                ) : null}
                {childBounty.curator ? (
                    <div>
                        <Label label={t('childBounty.info.curator')} />
                        <User user={childBounty.curator} />
                    </div>
                ) : null}
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
            <PolkassemblyDescription
                polkassemblyPostDto={childBounty.polkassembly}
                initialShow={!childBounty.description}
            />
        </div>
    )
}

export default ChildBountyInfo
