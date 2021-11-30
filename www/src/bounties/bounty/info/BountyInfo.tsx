import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import FormFooterButton from '../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../components/form/footer/FormFooterButtonsContainer'
import AddressInfo from '../../../components/identicon/AddressInfo'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import { Label } from '../../../components/text/Label'
import LongText from '../../../components/text/LongText'
import Placeholder from '../../../components/text/Placeholder'
import ShortText from '../../../components/text/ShortText'
import { ROUTE_EDIT_BOUNTY } from '../../../routes/routes'
import { timeToString } from '../../../util/dateUtil'
import { BountyDto, BountyStatus } from '../../bounties.dto'
import { useBounty } from '../useBounty'
import PolkassemblyDescription from '../../../components/polkassemblyDescription/PolkassemblyDescription'

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
                {bounty.status === BountyStatus.PendingPayout || bounty.status === BountyStatus.Active ? (
                    <div>
                        <Label label={t('bounty.info.beneficiary')} />
                        {bounty.beneficiary ? (
                            <AddressInfo address={bounty.beneficiary.address} ellipsed={true} />
                        ) : (
                            <Placeholder value={t('bounty.info.beneficiary')} />
                        )}
                    </div>
                ) : null}
            </div>
            {bounty.status === BountyStatus.Active ? (
                <div className={classes.spacing}>
                    <Label label={t('bounty.info.expiryDate')} />
                    {bounty.updateDue ? (
                        <ShortText text={timeToString(bounty.updateDue, t)} placeholder={t('bounty.info.expiryDate')} />
                    ) : (
                        <ShortText text={t('bounty.info.expired')} placeholder={t('bounty.info.expired')} />
                    )}
                </div>
            ) : null}
            {bounty.status === BountyStatus.PendingPayout ? (
                <div className={classes.spacing}>
                    <Label label={t('bounty.info.unlockDate')} />
                    {bounty.unlockAt ? (
                        <ShortText text={timeToString(bounty.unlockAt, t)} placeholder={t('bounty.info.unlockDate')} />
                    ) : (
                        <ShortText
                            text={t('bounty.info.payoutUnlocked')}
                            placeholder={t('bounty.info.payoutUnlocked')}
                        />
                    )}
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
            <PolkassemblyDescription polkassemblyPostDto={bounty.polkassembly} initialShow={!bounty.description}/>
        </div>
    )
}

export default BountyInfo
