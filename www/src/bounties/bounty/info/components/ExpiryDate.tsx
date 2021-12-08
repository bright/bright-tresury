import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { EventName } from '../../../../components/polkassemblyDescription/polkassembly-post.dto'
import { ClassNameProps } from '../../../../components/props/className.props'
import { Label } from '../../../../components/text/Label'
import ShortText from '../../../../components/text/ShortText'
import { dateToString, timeToString } from '../../../../util/dateUtil'
import { BountyDto, BountyStatus } from '../../../bounties.dto'

interface OwnProps {
    bounty: BountyDto
}

export type ExpiryDateProps = OwnProps & ClassNameProps

const ExpiryDate = ({ bounty, className }: ExpiryDateProps) => {
    const { t } = useTranslation()

    const extendedOn = useMemo((): string | undefined => {
        const bountyExtendedEvent = bounty.polkassembly?.events.find(
            (event) => event.eventName === EventName.BountyExtended,
        )
        if (!bountyExtendedEvent) {
            return
        }
        const date = new Date(bountyExtendedEvent.blockDateTime)
        if (isNaN(date.getTime())) {
            return
        }
        return dateToString(date)
    }, [bounty.polkassembly])

    return (
        <>
            {bounty.status === BountyStatus.Active ? (
                <>
                    <div className={className}>
                        <Label label={t('bounty.info.expiryDate')} />
                        {bounty.updateDue ? (
                            <ShortText
                                text={timeToString(bounty.updateDue, t)}
                                placeholder={t('bounty.info.expiryDate')}
                            />
                        ) : (
                            <ShortText text={t('bounty.info.expired')} placeholder={t('bounty.info.expired')} />
                        )}
                    </div>
                    {extendedOn ? (
                        <div className={className}>
                            <Label label={t('bounty.info.lastExtended')} />
                            <ShortText text={extendedOn} placeholder={t('bounty.info.lastExtended')} />
                        </div>
                    ) : null}
                </>
            ) : null}
        </>
    )
}

export default ExpiryDate
