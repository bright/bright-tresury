import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import BasicInfo from '../../../../../components/header/BasicInfo'
import BasicInfoDivider from '../../../../../components/header/details/BasicInfoDivider'
import HeaderContainer from '../../../../../components/header/details/HeaderContainer'
import NetworkValues from '../../../../../components/header/details/NetworkValues'
import Title from '../../../../../components/header/details/Title'
import FlexBreakLine from '../../../../../components/header/FlexBreakLine'
import HeaderTabs from '../../../../../components/header/HeaderTabs'
import OrdinalNumber from '../../../../../components/ordinalNumber/OrdinalNumber'
import OptionalTitle from '../../../../../components/text/OptionalTitle'
import { breakpoints } from '../../../../../theme/theme'
import { ChildBountyDto } from '../../child-bounties.dto'
import { ChildBountyTabConfig } from '../ChildBounty'
import NormalRouterLink from '../../../../../components/link/NormalRouterLink'
import { ROUTE_BOUNTY } from '../../../../../routes/routes'
import { BountyContentType } from '../../../Bounty'
import child_bounties from '../../../../../assets/child_bounties.svg'
import ChildBountyStatusIndicator from '../../components/ChildBountyStatusIndicator'
import ChildBountyNetworkRewardDeposit from './ChildBountyNetworkRewardDeposit'
import ChildBountyContentTypeTabs from './ChildBountyContentTypeTabs'
import ChildBountyOrdinalNumber from '../../components/ChildBountyOrdinalNumber'
import ActionButtons from '../../../../../components/header/details/ActionButtons'
import BountyActionButtons from '../../../header/curator-actions/BountyActionButtons'
import ChildBountyActionButtons from './ChildBountyActionButtons'
import BountyOptionsButton from '../../../header/options-menu/BountyOptionsButton'
import ChildBountyOptionsButton from './ChildBountyOptionsButton'
import { PublicUserDto } from '../../../../../util/publicUser.dto'
import { Nil } from '../../../../../util/types'

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
        bountyLink: {
            color: theme.palette.primary.main,
            fontWeight: 600,
            borderRadius: '8px',
            textDecoration: 'none',
            justifySelf: 'start',
        },
        childBountyArrow: {
            position: 'relative',
            top: '1px',
            marginRight: '3px',
            marginLeft: '10px',
        },
        container: {},
    }),
)

interface OwnProps {
    childBounty: ChildBountyDto
    childBountyTabsConfig: ChildBountyTabConfig[]
    bountyCurator: Nil<PublicUserDto>
}

export type ChildBountyHeaderProps = OwnProps

const ChildBountyHeader = ({ childBounty, bountyCurator, childBountyTabsConfig }: ChildBountyHeaderProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()

    const navigateToList = () => {
        history.goBack()
    }

    const routeToParentBounty = `${generatePath(ROUTE_BOUNTY, {
        bountyIndex: childBounty.parentBountyBlockchainIndex,
    })}/${BountyContentType.Info}`

    return (
        <HeaderContainer onClose={navigateToList}>
            <BasicInfo>
                <NormalRouterLink to={routeToParentBounty} className={classes.bountyLink}>
                    <OrdinalNumber
                        prefix={t('bounty.indexPrefix')}
                        ordinalNumber={childBounty.parentBountyBlockchainIndex}
                    />
                </NormalRouterLink>
                <img className={classes.childBountyArrow} alt={'Child-bounty icon'} src={child_bounties} />
                {t('childBounty.header.childBounty')}
                <ChildBountyOrdinalNumber
                    parentIndex={childBounty.parentBountyBlockchainIndex}
                    childBountyIndex={childBounty.blockchainIndex}
                />
                <BasicInfoDivider />
                <ChildBountyStatusIndicator status={childBounty.status} />
                <Title>
                    <OptionalTitle title={childBounty.title ?? childBounty.blockchainDescription} />
                </Title>
            </BasicInfo>
            <NetworkValues className={classes.networkValues}>
                <ChildBountyNetworkRewardDeposit childBounty={childBounty} />
            </NetworkValues>
            <FlexBreakLine className={classes.flexBreakLine} />
            <HeaderTabs className={classes.contentTypeTabs}>
                <ChildBountyContentTypeTabs childBountyTabsConfig={childBountyTabsConfig} />
            </HeaderTabs>
            <ActionButtons className={classes.actionButtons}>
                <ChildBountyActionButtons childBounty={childBounty} />
            </ActionButtons>
            <ChildBountyOptionsButton
                className={classes.optionsButton}
                childBounty={childBounty}
                bountyCurator={bountyCurator}
            />
        </HeaderContainer>
    )
}

export default ChildBountyHeader
