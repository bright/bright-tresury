import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../../auth/AuthContext'
import BasicInfo from '../../../components/header/BasicInfo'
import ActionButtons from '../../../components/header/details/ActionButtons'
import BasicInfoDivider from '../../../components/header/details/BasicInfoDivider'
import HeaderContainer from '../../../components/header/details/HeaderContainer'
import NetworkValues from '../../../components/header/details/NetworkValues'
import Title from '../../../components/header/details/Title'
import FlexBreakLine from '../../../components/header/FlexBreakLine'
import HeaderTabs from '../../../components/header/HeaderTabs'
import OrdinalNumber from '../../../components/ordinalNumber/OrdinalNumber'
import OptionalTitle from '../../../components/text/OptionalTitle'
import { breakpoints } from '../../../theme/theme'
import { BountyDto } from '../../bounties.dto'
import BountyNetworkRewardDeposit from '../../components/BountyNetworkRewardDeposit'
import BountyStatusIndicator from '../../components/BountyStatusIndicator'
import { BountyTabConfig } from '../Bounty'
import BountyContentTypeTabs from '../BountyContentTypeTabs'
import PrivateBountyContentTypeTabs from '../PrivateBountyContentTypeTabs'
import BountyActionButtons from './curator-actions/BountyActionButtons'
import { useBounty } from '../useBounty'
import BountyOptionsButton from './options-menu/BountyOptionsButton'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        flexBreakLine: {
            order: 3,
        },
        networkValues: {
            order: 2,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 3,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 3,
            },
        },
        contentTypeTabs: {
            order: 4,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 4,
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
                order: 5,
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                order: 2,
            },
        },
    }),
)

interface OwnProps {
    bounty: BountyDto
    bountyTabsConfig: BountyTabConfig[]
}

export type BountyHeaderProps = OwnProps

const BountyHeader = ({ bounty, bountyTabsConfig }: BountyHeaderProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()
    const { isProposer, isCurator } = useBounty(bounty)
    const { user } = useAuth()

    const navigateToList = () => {
        history.goBack()
    }

    return (
        <HeaderContainer onClose={navigateToList}>
            <BasicInfo>
                <OrdinalNumber prefix={t('bounty.indexPrefix')} ordinalNumber={bounty.blockchainIndex} />
                <BasicInfoDivider />
                <BountyStatusIndicator status={bounty.status} />
                <Title>
                    <OptionalTitle title={bounty.title ?? bounty.polkassembly?.title ?? bounty.blockchainDescription} />
                </Title>
            </BasicInfo>
            <NetworkValues className={classes.networkValues}>
                <BountyNetworkRewardDeposit bounty={bounty} />
            </NetworkValues>
            <FlexBreakLine className={classes.flexBreakLine} />
            <HeaderTabs className={classes.contentTypeTabs}>
                {user ? (
                    <PrivateBountyContentTypeTabs
                        bountyTabsConfig={bountyTabsConfig}
                        userId={user.id}
                        bountyIndex={bounty.blockchainIndex}
                    />
                ) : (
                    <BountyContentTypeTabs bountyTabsConfig={bountyTabsConfig} />
                )}
            </HeaderTabs>

            <BountyActionButtons className={classes.actionButtons} bounty={bounty} />

            {isProposer || isCurator ? <BountyOptionsButton className={classes.optionsButton} bounty={bounty} /> : null}
        </HeaderContainer>
    )
}

export default BountyHeader
