import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import Button from '../../../components/button/Button'
import FormFooterButton from '../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../components/form/footer/FormFooterButtonsContainer'
import AddressInfo from '../../../components/identicon/AddressInfo'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import { Label } from '../../../components/text/Label'
import LongText from '../../../components/text/LongText'
import ShortText from '../../../components/text/ShortText'
import { ROUTE_EDIT_BOUNTY } from '../../../routes/routes'
import { breakpoints } from '../../../theme/theme'
import { timeToString } from '../../../util/dateUtil'
import { BountyDto, BountyStatus } from '../../bounties.dto'
import { useBounty } from '../useBounty'

const useStyles = makeStyles((theme: Theme) =>
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
        editButton: {
            alignSelf: 'end',
        },
    }),
)

interface OwnProps {
    bounty: BountyDto
}

export type BountyDetailsProps = OwnProps

const BountyInfo = ({ bounty }: BountyDetailsProps) => {
    const classes = useStyles()
    const loadedClasses = useSuccessfullyLoadedItemStyles()
    const { t } = useTranslation()
    const history = useHistory()
    const { canEdit } = useBounty(bounty)

    const navigateToEdit = () => {
        history.push(generatePath(ROUTE_EDIT_BOUNTY, { bountyIndex: bounty.blockchainIndex }))
    }

    return (
        <div className={loadedClasses.content}>
            {canEdit && (
                <FormFooterButtonsContainer>
                    <FormFooterButton
                        className={classes.editButton}
                        variant="contained"
                        color="primary"
                        onClick={navigateToEdit}
                    >
                        {t('bounty.info.editButton')}
                    </FormFooterButton>
                </FormFooterButtonsContainer>
            )}
            <div className={classes.addresses}>
                <div>
                    <Label label={t('bounty.info.proposer')} />
                    <AddressInfo address={bounty.proposer.address} ellipsed={true} />
                </div>
                {bounty.status === BountyStatus.CuratorProposed ? (
                    <div>
                        <Label label={t('bounty.info.proposedCurator')} />
                        <AddressInfo address={bounty.curator.address} ellipsed={true} />
                    </div>
                ) : null}
                {bounty.status === BountyStatus.Active || bounty.status === BountyStatus.PendingPayout ? (
                    <div>
                        <Label label={t('bounty.info.curator')} />
                        <AddressInfo address={bounty.curator.address} ellipsed={true} />
                    </div>
                ) : null}
                {bounty.status === BountyStatus.PendingPayout ? (
                    <div>
                        <Label label={t('bounty.info.beneficiary')} />
                        <AddressInfo address={bounty.beneficiary.address} ellipsed={true} />
                    </div>
                ) : null}
            </div>
            {bounty.status === BountyStatus.Active ? (
                <div className={classes.spacing}>
                    {/*TODO style date*/}
                    <Label label={t('bounty.info.expiryDate')} />
                    <ShortText text={timeToString(bounty.updateDue, t)} placeholder={t('bounty.info.expiryDate')} />
                </div>
            ) : null}
            {bounty.status === BountyStatus.PendingPayout ? (
                <div className={classes.spacing}>
                    {/*TODO style date*/}
                    <Label label={t('bounty.info.unlockDate')} />
                    <ShortText text={timeToString(bounty.unlockAt, t)} placeholder={t('bounty.info.unlockDate')} />
                </div>
            ) : null}
            <div className={classes.spacing}>
                <Label label={t('bounty.info.field')} />
                <ShortText text={bounty.field} placeholder={t('bounty.info.field')} />
            </div>
            <div className={classes.spacing}>
                <Label label={t('bounty.info.description')} />
                <LongText text={bounty.description} placeholder={t('bounty.info.description')} />
            </div>
            <div className={classes.spacing}>
                <Label label={t('bounty.info.onChainDescription')} />
                <ShortText text={bounty.blockchainDescription} placeholder={t('bounty.info.onChainDescription')} />
            </div>
        </div>
    )
}

export default BountyInfo
