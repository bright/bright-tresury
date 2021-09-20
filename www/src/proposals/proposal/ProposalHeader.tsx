import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ProposalContentTypeTabs } from './ProposalContentTypeTabs'
import { breakpoints } from '../../theme/theme'
import ProposalIndex from '../list/ProposalIndex'
import ProposalStatusIndicator from '../status/ProposalStatusIndicator'
import { ProposalDto } from '../proposals.dto'
import NetworkRewardDeposit from '../../components/network/NetworkRewardDeposit'
import { useHistory } from 'react-router-dom'
import OptionalTitle from '../../components/text/OptionalTitle'
import HeaderContainer from '../../components/header/details/HeaderContainer'
import BasicInfo from '../../components/header/BasicInfo'
import NetworkValues from '../../components/header/details/NetworkValues'
import FlexBreakLine from '../../components/header/FlexBreakLine'
import HeaderTabs from '../../components/header/HeaderTabs'
import BasicInfoDivider from '../../components/header/details/BasicInfoDivider'
import Title from '../../components/header/details/Title'
import Status from '../../components/header/details/Status'
import CloseButton from '../../components/closeIcon/CloseButton'

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
    searchParamName: string
}

export type ProposalHeaderProps = OwnProps

const ProposalHeader = ({ proposal, searchParamName }: ProposalHeaderProps) => {
    const classes = useStyles()
    const history = useHistory()

    const navigateToList = () => {
        history.goBack()
    }

    return (
        <HeaderContainer>
            <CloseButton onClose={navigateToList} className={classes.closeIcon} />

            <BasicInfo>
                <ProposalIndex proposalIndex={proposal.proposalIndex} />
                <BasicInfoDivider />
                <Status>
                    <ProposalStatusIndicator status={proposal.status} />
                </Status>
                <Title>
                    <OptionalTitle title={proposal.details?.title} />
                </Title>
            </BasicInfo>

            <NetworkValues className={classes.networkValues}>
                <NetworkRewardDeposit rewardValue={proposal.value} bondValue={proposal.bond} />
            </NetworkValues>

            <FlexBreakLine className={classes.flexBreakLine} />

            <HeaderTabs className={classes.contentTypeTabs}>
                <ProposalContentTypeTabs />
            </HeaderTabs>
        </HeaderContainer>
    )
}

export default ProposalHeader
