import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import Button from '../../components/button/Button'
import CloseButton from '../../components/closeIcon/CloseButton'
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
import { ROUTE_TURN_IDEA } from '../../routes/routes'
import { breakpoints } from '../../theme/theme'
import { IdeaDto } from '../ideas.dto'
import IdeaContentTypeTabs from './IdeaContentTypeTabs'
import PrivateIdeaContentTypeTabs from './PrivateIdeaContentTypeTabs'
import OptionsButton from './OptionsButton'
import IdeaStatusIndicator from './status/IdeaStatusIndicator'
import { useIdea } from './useIdea'
import { IdeaContentType, IdeaTabConfig } from './Idea'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        flexBreakLine: {
            order: 3,
        },
        networkValues: {
            order: 2,
            marginRight: '-40px',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 4,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
            },
        },
        closeIcon: {
            order: 3,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
            },
        },
        closeIconOnTablet: {
            [theme.breakpoints.down(breakpoints.tablet)]: {
                display: 'none',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                display: 'none',
            },
        },
        contentTypeTabs: {
            order: 4,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 5,
            },
        },
        turnIntoProposal: {
            order: 5,
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '5px',
            flexGrow: 1,
            [theme.breakpoints.up(breakpoints.mobile)]: {
                alignSelf: 'flex-end',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                position: 'fixed',
                padding: 16,
                background: theme.palette.background.default,
                bottom: '-30px',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                width: '100vw',
                zIndex: 1,
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
                flexGrow: 'unset',
                marginBottom: '25px',
                marginRight: '5px',
            },
        },
        turnIntoProposalButton: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '100%',
            },
        },
        tabletViewContainer: {
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                display: 'flex',
                order: 3,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                display: 'flex',
                order: 1,
            },
        },
        optionsButton: {
            order: 6,
            marginRight: '20px',
            display: 'flex',
            justifyContent: 'center',
        },
        formatIconOnTablet: {
            [theme.breakpoints.down(breakpoints.tablet)]: {
                marginRight: '0',
                alignSelf: 'center',
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

    const navigateToTurnIntoProposal = () => {
        history.push(generatePath(ROUTE_TURN_IDEA, { ideaId: idea.id }), { idea })
    }

    const networkValue = idea.currentNetwork.value
    const withDiscussion = !!ideaTabsConfig.find(
        ({ ideaContentType }) => ideaContentType === IdeaContentType.Discussion,
    )
    return (
        <HeaderContainer>
            <CloseButton onClose={navigateToList} className={clsx(classes.closeIcon, classes.closeIconOnTablet)} />
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
            <div className={classes.tabletViewContainer}>
                <CloseButton
                    onClose={navigateToList}
                    className={clsx(classes.closeIcon, classes.formatIconOnTablet)}
                ></CloseButton>
                {isOwner ? <OptionsButton className={classes.formatIconOnTablet} idea={idea} /> : null}
            </div>
            <FlexBreakLine className={classes.flexBreakLine} />
            <HeaderTabs className={classes.contentTypeTabs}>
                {isUserSignedInAndVerified && user && withDiscussion ? (
                    <PrivateIdeaContentTypeTabs userId={user.id} ideaId={idea.id} ideaTabsConfig={ideaTabsConfig} />
                ) : (
                    <IdeaContentTypeTabs ideaTabsConfig={ideaTabsConfig} />
                )}
            </HeaderTabs>
            {canTurnIntoProposal && (
                <div className={classes.turnIntoProposal}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.turnIntoProposalButton}
                        onClick={navigateToTurnIntoProposal}
                    >
                        {t('idea.details.header.turnIntoProposal')}
                    </Button>
                </div>
            )}
            {isOwner ? <OptionsButton className={classes.closeIconOnTablet} idea={idea} /> : null}
        </HeaderContainer>
    )
}

export default IdeaHeader
