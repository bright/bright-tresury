import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import BasicInfo from '../../components/header/BasicInfo'
import BasicInfoDivider from '../../components/header/details/BasicInfoDivider'
import HeaderContainer from '../../components/header/details/HeaderContainer'
import NetworkValues from '../../components/header/details/NetworkValues'
import Title from '../../components/header/details/Title'
import FlexBreakLine from '../../components/header/FlexBreakLine'
import HeaderTabs from '../../components/header/HeaderTabs'
import ProposalNetworkRewardDeposit from '../../components/network/ProposalNetworkRewardDeposit'
import OrdinalNumber from '../../components/ordinalNumber/OrdinalNumber'
import OptionalTitle from '../../components/text/OptionalTitle'
import { breakpoints } from '../../theme/theme'
import { IdeaDto } from '../ideas.dto'
import IdeaContentTypeTabs from './IdeaContentTypeTabs'
import PrivateIdeaContentTypeTabs from './PrivateIdeaContentTypeTabs'
import IdeaOptionsButton from './IdeaOptionsButton'
import IdeaStatusIndicator from './status/IdeaStatusIndicator'
import { useIdea } from './useIdea'
import { IdeaContentType, IdeaTabConfig } from './Idea'
import IdeaActionButtons from './IdeaActionButtons'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        flexBreakLine: {
            order: 3,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 4,
            },
        },
        networkValues: {
            order: 2,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 5,
            },
        },
        contentTypeTabs: {
            order: 4,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 6,
            },
        },
        actionButtons: {
            order: 6,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
            },
        },
        optionsButton: {
            order: 7,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 3,
            },
        },
    }),
)

interface OwnProps {
    idea: IdeaDto
    ideaTabsConfig: IdeaTabConfig[]
}

export type IdeaHeaderProps = OwnProps

const IdeaHeader = ({ idea, ideaTabsConfig }: IdeaHeaderProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()
    const { canTurnIntoProposal, isOwner } = useIdea(idea)
    const { user, isUserSignedInAndVerified } = useAuth()

    const navigateToList = () => {
        history.goBack()
    }

    const networkValue = idea.currentNetwork.value
    const withDiscussion = !!ideaTabsConfig.find(
        ({ ideaContentType }) => ideaContentType === IdeaContentType.Discussion,
    )

    return (
        <HeaderContainer onClose={navigateToList}>
            <BasicInfo>
                <OrdinalNumber prefix={t('idea.ordinalNumberPrefix')} ordinalNumber={idea.ordinalNumber} />
                <BasicInfoDivider />
                <IdeaStatusIndicator idea={idea} />
                <Title>
                    <OptionalTitle title={idea.details.title} />
                </Title>
            </BasicInfo>
            <NetworkValues className={classes.networkValues}>
                <ProposalNetworkRewardDeposit rewardValue={networkValue} />
            </NetworkValues>
            <FlexBreakLine className={classes.flexBreakLine} />
            <HeaderTabs className={classes.contentTypeTabs}>
                {isUserSignedInAndVerified && user && withDiscussion ? (
                    <PrivateIdeaContentTypeTabs userId={user.id} ideaId={idea.id} ideaTabsConfig={ideaTabsConfig} />
                ) : (
                    <IdeaContentTypeTabs ideaTabsConfig={ideaTabsConfig} />
                )}
            </HeaderTabs>
            {canTurnIntoProposal ? <IdeaActionButtons className={classes.actionButtons} idea={idea} /> : null}
            {isOwner ? <IdeaOptionsButton className={classes.optionsButton} idea={idea} /> : null}
        </HeaderContainer>
    )
}
export default IdeaHeader
