import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { breakpoints } from '../../../theme/theme'
import { TipTabConfig } from '../Tip'
import HeaderContainer from '../../../components/header/details/HeaderContainer'
import BasicInfo from '../../../components/header/BasicInfo'
import Title from '../../../components/header/details/Title'
import FlexBreakLine from '../../../components/header/FlexBreakLine'
import HeaderTabs from '../../../components/header/HeaderTabs'
import OptionalTitle from '../../../components/text/OptionalTitle'
import TipContentTypeTabs from '../TipContentTypeTabs'
import Hash from './Hash'
import { TipDto } from '../../tips.dto'
import TipOptionsButton from './TipOptionsButton'
import { useTip } from '../useTip'
import NetworkValues from '../../../components/header/details/NetworkValues'
import TipsNetworkValues from './TipNetworkValues'
import TipPolkassemblyShareButton from './TipPolkassemblyShareButton'
import ActionButtons from '../../../components/header/details/ActionButtons'

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
    tip: TipDto
    tipTabsConfig: TipTabConfig[]
}

export type TipHeaderProps = OwnProps

const TipHeader = ({ tip, tipTabsConfig }: TipHeaderProps) => {
    const classes = useStyles()
    const { t } = useTranslation()
    const history = useHistory()
    const { isOwner, isFinder, isBeneficiary } = useTip(tip)
    const navigateToList = () => {
        history.goBack()
    }

    return (
        <HeaderContainer onClose={navigateToList}>
            <BasicInfo>
                <Hash prefix={t('tip.indexPrefix')} hash={tip.hash} />
                <Title>
                    <OptionalTitle title={tip.title ?? tip.polkassembly?.title ?? tip.reason} />
                </Title>
            </BasicInfo>
            <NetworkValues className={classes.networkValues}>
                <TipsNetworkValues tip={tip} />
            </NetworkValues>
            <FlexBreakLine className={classes.flexBreakLine} />
            <HeaderTabs className={classes.contentTypeTabs}>
                <TipContentTypeTabs tipTabsConfig={tipTabsConfig} />
            </HeaderTabs>

            <ActionButtons className={classes.actionButtons}>
                {isFinder ? <TipPolkassemblyShareButton tip={tip} /> : null}
                {isOwner || isFinder || isBeneficiary ? (
                    <TipOptionsButton className={classes.optionsButton} tip={tip} />
                ) : null}
            </ActionButtons>
        </HeaderContainer>
    )
}

export default TipHeader
