import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import AddressInfo from '../../../components/identicon/AddressInfo'
import { Label } from '../../../components/text/Label'
import Placeholder from '../../../components/text/Placeholder'
import IdeaProposalDetails from '../../../idea-proposal-details/details/IdeaProposalDetails'
import { breakpoints } from '../../../theme/theme'
import { IdeaDto } from '../../ideas.dto'
import { useIdea } from '../useIdea'
import AdditionalNetworkDetailsCard from './AdditionalNetworkDetailsCard'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        details: {
            width: '70%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
                padding: '16px',
                fontSize: '18px',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '10px',
                fontSize: '14px',
            },
        },
        spacing: {
            marginTop: '2em',
        },
    }),
)

interface OwnProps {
    idea: IdeaDto
}

export type IdeaDetailsProps = OwnProps

const IdeaDetails = ({ idea }: IdeaDetailsProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { isOwner } = useIdea(idea)

    return (
        <>
            <Label label={t('idea.details.beneficiary')} />
            {idea.beneficiary ? (
                <AddressInfo address={idea.beneficiary} ellipsed={false} />
            ) : (
                <Placeholder value={t('idea.details.beneficiary')} />
            )}
            <div className={classes.details}>
                <IdeaProposalDetails details={idea.details} />
                <Label label={t('idea.details.additionalNets')} className={classes.spacing} />
                {idea.additionalNetworks.map((additionalNetwork) => (
                    <AdditionalNetworkDetailsCard ideaNetwork={additionalNetwork} isOwner={isOwner} />
                ))}
            </div>
        </>
    )
}

export default IdeaDetails
