import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import FormFooterButton from '../../../components/form/footer/FormFooterButton'
import FormFooterButtonsContainer from '../../../components/form/footer/FormFooterButtonsContainer'
import AddressInfo from '../../../components/identicon/AddressInfo'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import { Label } from '../../../components/text/Label'
import Placeholder from '../../../components/text/Placeholder'
import IdeaProposalDetails from '../../../idea-proposal-details/details/IdeaProposalDetails'
import { ROUTE_EDIT_IDEA } from '../../../routes/routes'
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
    const loadedClasses = useSuccessfullyLoadedItemStyles()
    const { t } = useTranslation()
    const { canEditIdea, isOwner } = useIdea(idea)
    const history = useHistory()

    const navigateToEdit = () => {
        history.push(generatePath(ROUTE_EDIT_IDEA, { ideaId: idea.id }))
    }

    return (
        <div className={loadedClasses.content}>
            {canEditIdea ? (
                <FormFooterButtonsContainer>
                    <FormFooterButton onClick={navigateToEdit}>{t('idea.details.edit')}</FormFooterButton>
                </FormFooterButtonsContainer>
            ) : null}
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
        </div>
    )
}

export default IdeaDetails
