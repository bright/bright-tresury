import React from 'react'
import { Switch, useRouteMatch } from 'react-router-dom'
import infoIcon from '../../assets/info.svg'
import voting from '../../assets/voting.svg'
import child_bounties from '../../assets/child_bounties.svg'
import discussionIcon from '../../assets/discussion.svg'
import { useSuccessfullyLoadedItemStyles } from '../../components/loading/useSuccessfullyLoadedItemStyles'
import PrivateRoute from '../../routes/PrivateRoute'
import Route from '../../routes/Route'
import { ROUTE_AWARD_BOUNTY, ROUTE_EDIT_BOUNTY, ROUTE_EXTEND_EXPIRY_BOUNTY } from '../../routes/routes'
import { Nil } from '../../util/types'
import { BountyDto } from '../bounties.dto'
import BountyDiscussion from './discussion/BountyDiscussion'
import BountyHeader from './header/BountyHeader'
import BountyEdit from './edit/BountyEdit'
import BountyAward from './header/curator-actions/award/BountyAward'
import BountyExtendExpiry from './header/curator-actions/extend-expiry/BountyExtendExpiry'
import BountyInfo from './info/BountyInfo'
import BountyVoting from './voting/BountyVoting'
import ChildBountiesLoader from './child-bounties/ChildBountiesLoader'

export enum BountyContentType {
    Info = 'info',
    Discussion = 'discussion',
    Voting = 'voting',
    ChildBounties = 'child-bounties',
}

const BOUNTY_CONTENT_TYPE_BUILDER: { [key in BountyContentType]?: BountyTabConfig } = {
    [BountyContentType.Info]: {
        bountyContentType: BountyContentType.Info,
        translationKey: 'bounty.content.infoLabel',
        svg: infoIcon,
        getUrl: (baseUrl: string) => `${baseUrl}/${BountyContentType.Info}`,
        getRoute: (basePath: string, bounty: BountyDto) => (
            <Route key={BountyContentType.Info} exact={true} path={`${basePath}/${BountyContentType.Info}`}>
                <BountyInfo bounty={bounty} />
            </Route>
        ),
        isDefault: true,
    },
    [BountyContentType.Discussion]: {
        bountyContentType: BountyContentType.Discussion,
        translationKey: 'bounty.content.discussionLabel',
        svg: discussionIcon,
        getUrl: (baseUrl: string) => `${baseUrl}/${BountyContentType.Discussion}`,
        getRoute: (basePath: string, bounty: BountyDto) => (
            <Route key={BountyContentType.Discussion} exact={true} path={`${basePath}/${BountyContentType.Discussion}`}>
                <BountyDiscussion bounty={bounty} />
            </Route>
        ),
    },
    [BountyContentType.Voting]: {
        bountyContentType: BountyContentType.Voting,
        translationKey: 'bounty.content.votingLabel',
        svg: voting,
        getUrl: (baseUrl: string) => `${baseUrl}/${BountyContentType.Voting}`,
        getRoute: (basePath: string, bounty: BountyDto) => (
            <Route key={BountyContentType.Voting} exact={true} path={`${basePath}/${BountyContentType.Voting}`}>
                <BountyVoting bounty={bounty} />
            </Route>
        ),
    },
    [BountyContentType.ChildBounties]: {
        bountyContentType: BountyContentType.ChildBounties,
        translationKey: 'bounty.content.childBounties',
        svg: child_bounties,
        getUrl: (baseUrl: string) => `${baseUrl}/${BountyContentType.ChildBounties}`,
        getRoute: (basePath: string, bounty: BountyDto) => (
            <Route
                key={BountyContentType.ChildBounties}
                exact={true}
                path={`${basePath}/${BountyContentType.ChildBounties}`}
            >
                <ChildBountiesLoader bounty={bounty} />
            </Route>
        ),
    },
}

export interface BountyTabConfig {
    bountyContentType: BountyContentType
    translationKey: string
    svg: string
    getUrl: (baseUrl: string) => string
    getRoute: (basePath: string, bounty: BountyDto) => JSX.Element
    notificationsCount?: Nil<number>
    isDefault?: boolean
}
interface OwnProps {
    bounty: BountyDto
}
export type BountyProps = OwnProps
const Bounty = ({ bounty }: BountyProps) => {
    const classes = useSuccessfullyLoadedItemStyles()

    let { path } = useRouteMatch()

    const bountyTabsConfig = Object.values(BOUNTY_CONTENT_TYPE_BUILDER)

    const routes = bountyTabsConfig.map(({ getRoute }) => getRoute(path, bounty))

    return (
        <div className={classes.root}>
            <Switch>
                <PrivateRoute requireVerified={true} exact={true} path={ROUTE_EDIT_BOUNTY}>
                    <BountyEdit bounty={bounty} />
                </PrivateRoute>
                <PrivateRoute requireVerified={true} exact={true} path={ROUTE_AWARD_BOUNTY}>
                    <BountyAward bounty={bounty} />
                </PrivateRoute>
                <PrivateRoute requireVerified={true} exact={true} path={ROUTE_EXTEND_EXPIRY_BOUNTY}>
                    <BountyExtendExpiry bounty={bounty} />
                </PrivateRoute>

                <>
                    <BountyHeader bounty={bounty} bountyTabsConfig={bountyTabsConfig} />
                    <Switch>
                        <Route exact={true} path={path}>
                            <BountyInfo bounty={bounty} />
                        </Route>
                        {routes}
                    </Switch>
                </>
            </Switch>
        </div>
    )
}

export default Bounty
