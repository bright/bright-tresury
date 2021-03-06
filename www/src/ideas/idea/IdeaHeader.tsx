import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import { Button } from '../../components/button/Button'
import { BasicInfo } from '../../components/header/BasicInfo'
import { BasicInfoDivider } from '../../components/header/details/BasicInfoDivider'
import { HeaderContainer } from '../../components/header/details/HeaderContainer'
import { NetworkValues } from '../../components/header/details/NetworkValues'
import { Status } from '../../components/header/details/Status'
import { Title } from '../../components/header/details/Title'
import { FlexBreakLine } from '../../components/header/FlexBreakLine'
import { HeaderTabs } from '../../components/header/HeaderTabs'
import { NetworkRewardDeposit } from '../../components/network/NetworkRewardDeposit'
import { OptionalTitle } from '../../components/text/OptionalTitle'
import { ROUTE_TURN_IDEA } from '../../routes/routes'
import { breakpoints } from '../../theme/theme'
import IdeaContentTypeTabs from './IdeaContentTypeTabs'
import { IdeaStatusIndicator } from './status/IdeaStatusIndicator'
import { OrdinalNumber } from '../../components/ordinalNumber/OrdinalNumber'
import { IdeaDto, IdeaStatus } from '../ideas.dto'
import CloseButton from '../../components/closeIcon/CloseButton'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        flexBreakLine: {
            order: 3,
        },
        networkValues: {
            order: 2,
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
        contentTypeTabs: {
            order: 4,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 5,
            },
        },
        turnIntoProposal: {
            order: 5,
            [theme.breakpoints.up(breakpoints.mobile)]: {
                alignSelf: 'flex-end',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                position: 'fixed',
                padding: 16,
                background: theme.palette.background.default,
                bottom: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                width: '100vw',
                zIndex: 1,
            },
        },
        turnIntoProposalButton: {
            [theme.breakpoints.down(breakpoints.mobile)]: {
                width: '100%',
            },
        },
    }),
)

export interface IdeaHeaderProps {
    idea: IdeaDto
    canEdit: boolean
}

const IdeaHeader = ({ idea, canEdit }: IdeaHeaderProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()

    const navigateToList = () => {
        history.goBack()
    }

    const navigateToTurnIntoProposal = () => {
        history.push(generatePath(ROUTE_TURN_IDEA, { ideaId: idea.id }), { idea })
    }

    const canTurnIntoProposal = useMemo(
        () =>
            !!idea.id &&
            canEdit &&
            ![IdeaStatus.TurnedIntoProposal, IdeaStatus.TurnedIntoProposalByMilestone].includes(idea.status),
        [idea, canEdit],
    )

    const networkValue = idea.networks && idea.networks.length > 0 ? idea.networks[0].value : 0

    return (
        <HeaderContainer>
            <CloseButton onClose={navigateToList} className={classes.closeIcon} />
            <BasicInfo>
                <OrdinalNumber prefix={t('idea.ordinalNumberPrefix')} ordinalNumber={idea.ordinalNumber} />
                <BasicInfoDivider />
                <Status>
                    <IdeaStatusIndicator status={idea.status} />
                </Status>
                <Title>
                    <OptionalTitle title={idea.title} />
                </Title>
            </BasicInfo>
            <NetworkValues className={classes.networkValues}>
                <NetworkRewardDeposit rewardValue={networkValue} />
            </NetworkValues>
            <FlexBreakLine className={classes.flexBreakLine} />
            <HeaderTabs className={classes.contentTypeTabs}>
                <IdeaContentTypeTabs />
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
        </HeaderContainer>
    )
}

export default IdeaHeader
