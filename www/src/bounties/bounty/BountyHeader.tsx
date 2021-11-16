import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import CloseButton from '../../components/closeIcon/CloseButton'
import BasicInfo from '../../components/header/BasicInfo'
import BasicInfoDivider from '../../components/header/details/BasicInfoDivider'
import HeaderContainer from '../../components/header/details/HeaderContainer'
import NetworkValues from '../../components/header/details/NetworkValues'
import Title from '../../components/header/details/Title'
import FlexBreakLine from '../../components/header/FlexBreakLine'
import HeaderTabs from '../../components/header/HeaderTabs'
import OrdinalNumber from '../../components/ordinalNumber/OrdinalNumber'
import OptionalTitle from '../../components/text/OptionalTitle'
import { breakpoints } from '../../theme/theme'
import { BountyDto } from '../bounties.dto'
import BountyNetworkRewardDeposit from '../components/BountyNetworkRewardDeposit'
import BountyStatusIndicator from '../components/BountyStatusIndicator'
import { BountyTabConfig } from './Bounty'
import BountyContentTypeTabs from './BountyContentTypeTabs'
import { useBounty } from './useBounty'

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
        closeIcon: {
            order: 3,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 2,
            },
        },
        contentTypeTabs: {
            order: 4,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                order: 5,
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
    const {} = useBounty(bounty)

    const navigateToList = () => {
        history.goBack()
    }

    return (
        <HeaderContainer>
            <CloseButton onClose={navigateToList} className={clsx(classes.closeIcon)} />
            <BasicInfo>
                <OrdinalNumber prefix={t('bounty.indexPrefix')} ordinalNumber={bounty.blockchainIndex} />
                <BasicInfoDivider />
                <BountyStatusIndicator status={bounty.status} />
                <Title>
                    <OptionalTitle title={bounty.title || bounty.blockchainDescription} />
                </Title>
            </BasicInfo>
            <NetworkValues className={classes.networkValues}>
                <BountyNetworkRewardDeposit bounty={bounty} />
            </NetworkValues>
            <FlexBreakLine className={classes.flexBreakLine} />
            <HeaderTabs className={classes.contentTypeTabs}>
                <BountyContentTypeTabs bountyTabsConfig={bountyTabsConfig} />
            </HeaderTabs>
        </HeaderContainer>
    )
}

export default BountyHeader
