import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useAuth } from '../../auth/AuthContext'
import { ProposalContentTypeTabs } from './ProposalContentTypeTabs'
import { breakpoints } from '../../theme/theme'
import ProposalIndex from '../list/ProposalIndex'
import ProposalStatusIndicator from '../status/ProposalStatusIndicator'
import { ProposalDto } from '../proposals.dto'
import ProposalNetworkRewardDeposit from '../../components/network/ProposalNetworkRewardDeposit'
import { useHistory } from 'react-router-dom'
import OptionalTitle from '../../components/text/OptionalTitle'
import HeaderContainer from '../../components/header/details/HeaderContainer'
import BasicInfo from '../../components/header/BasicInfo'
import NetworkValues from '../../components/header/details/NetworkValues'
import FlexBreakLine from '../../components/header/FlexBreakLine'
import HeaderTabs from '../../components/header/HeaderTabs'
import BasicInfoDivider from '../../components/header/details/BasicInfoDivider'
import Title from '../../components/header/details/Title'
import PrivateProposalContentTypeTabs from './PrivateProposalContentTypeTabs'
import { ProposalTabConfig } from './Proposal'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        flexBreakLine: {
            order: 4,
        },
        closeIcon: {
            order: 3,
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
            },
        },
        networkValues: {
            order: 2,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 4,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 3,
            },
        },
        contentTypeTabs: {
            order: 5,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 6,
            },
        },
    }),
)

interface OwnProps {
    proposal: ProposalDto
    proposalTabsConfig: ProposalTabConfig[]
}

export type ProposalHeaderProps = OwnProps

const ProposalHeader = ({ proposal, proposalTabsConfig }: ProposalHeaderProps) => {
    const classes = useStyles()
    const history = useHistory()
    const { user, isUserSignedInAndVerified } = useAuth()

    const navigateToList = () => {
        history.goBack()
    }

    return (
        <HeaderContainer onClose={navigateToList}>
            <BasicInfo>
                <ProposalIndex proposalIndex={proposal.proposalIndex} />
                <BasicInfoDivider />
                <ProposalStatusIndicator status={proposal.status} />
                <Title>
                    <OptionalTitle title={proposal.details?.title ?? proposal.polkassembly?.title} />
                </Title>
            </BasicInfo>

            <NetworkValues className={classes.networkValues}>
                <ProposalNetworkRewardDeposit rewardValue={proposal.value} bondValue={proposal.bond} />
            </NetworkValues>

            <FlexBreakLine className={classes.flexBreakLine} />

            <HeaderTabs className={classes.contentTypeTabs}>
                {isUserSignedInAndVerified && user ? (
                    <PrivateProposalContentTypeTabs
                        userId={user.id}
                        proposalIndex={proposal.proposalIndex}
                        proposalTabsConfig={proposalTabsConfig}
                    />
                ) : (
                    <ProposalContentTypeTabs proposalTabsConfig={proposalTabsConfig} />
                )}
            </HeaderTabs>
        </HeaderContainer>
    )
}

export default ProposalHeader
