import React from 'react'
import { Switch, useRouteMatch } from 'react-router-dom'
import infoIcon from '../../../../assets/info.svg'
import { ChildBountyDto } from '../child-bounties.dto'
import ChildBountyInfo from './info/ChildBountyInfo'
import Route from '../../../../routes/Route'
import { Nil } from '../../../../util/types'
import { useSuccessfullyLoadedItemStyles } from '../../../../components/loading/useSuccessfullyLoadedItemStyles'
import ChildBountyHeader from './header/ChildBountyHeader'
import discussionIcon from '../../../../assets/discussion.svg'
import ChildBountyDiscussion from './discussion/ChildBountyDiscussion'
import PrivateRoute from '../../../../routes/PrivateRoute'
import { ROUTE_ASSIGN_CHILD_BOUNTY_CURATOR, ROUTE_NEW_CHILD_BOUNTY } from '../../../../routes/routes'
import AssignChildBountyCurator from './assign-curator/AssignChildBountyCurator'

export enum ChildBountyContentType {
    Info = 'info',
    Discussion = 'Discussion',
}

const CHILD_BOUNTY_CONTENT_TYPE_BUILDER: { [key in ChildBountyContentType]?: ChildBountyTabConfig } = {
    [ChildBountyContentType.Info]: {
        childBountyContentType: ChildBountyContentType.Info,
        translationKey: 'childBounty.content.infoLabel',
        svg: infoIcon,
        getUrl: (baseUrl: string) => `${baseUrl}/${ChildBountyContentType.Info}`,
        getRoute: (basePath: string, childBounty: ChildBountyDto) => (
            <Route key={ChildBountyContentType.Info} exact={true} path={`${basePath}/${ChildBountyContentType.Info}`}>
                <ChildBountyInfo childBounty={childBounty} />
            </Route>
        ),
        isDefault: true,
    },
    [ChildBountyContentType.Discussion]: {
        childBountyContentType: ChildBountyContentType.Discussion,
        translationKey: 'bounty.content.discussionLabel',
        svg: discussionIcon,
        getUrl: (baseUrl: string) => `${baseUrl}/${ChildBountyContentType.Discussion}`,
        getRoute: (basePath: string, childBounty: ChildBountyDto) => (
            <Route
                key={ChildBountyContentType.Discussion}
                exact={true}
                path={`${basePath}/${ChildBountyContentType.Discussion}`}
            >
                <ChildBountyDiscussion childBounty={childBounty} />
            </Route>
        ),
    },
}

export interface ChildBountyTabConfig {
    childBountyContentType: ChildBountyContentType
    translationKey: string
    svg: string
    getUrl: (baseUrl: string) => string
    getRoute: (basePath: string, childBounty: ChildBountyDto) => JSX.Element
    notificationsCount?: Nil<number>
    isDefault?: boolean
}
interface OwnProps {
    childBounty: ChildBountyDto
}
export type ChildBountyProps = OwnProps
const ChildBounty = ({ childBounty }: ChildBountyProps) => {
    const classes = useSuccessfullyLoadedItemStyles()
    let { path } = useRouteMatch()

    const childBountyTabsConfig = Object.values(CHILD_BOUNTY_CONTENT_TYPE_BUILDER)
    const routes = childBountyTabsConfig.map(({ getRoute }) => getRoute(path, childBounty))
    console.log('redraw ChildBounty')
    return (
        <div className={classes.root}>
            <Switch>
                <PrivateRoute requireVerified={true} exact={true} path={ROUTE_ASSIGN_CHILD_BOUNTY_CURATOR}>
                    <AssignChildBountyCurator childBounty={childBounty} />
                </PrivateRoute>
                <>
                    <ChildBountyHeader childBounty={childBounty} childBountyTabsConfig={childBountyTabsConfig} />
                    <Switch>
                        <Route exact={true} path={path}>
                            <ChildBountyInfo childBounty={childBounty} />
                        </Route>
                        {routes}
                    </Switch>
                </>
            </Switch>
        </div>
    )
}

export default ChildBounty
