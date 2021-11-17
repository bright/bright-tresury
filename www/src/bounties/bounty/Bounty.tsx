import React from 'react'
import { Switch, useRouteMatch } from 'react-router-dom'
import infoIcon from '../../assets/info.svg'
import { useSuccessfullyLoadedItemStyles } from '../../components/loading/useSuccessfullyLoadedItemStyles'
import PrivateRoute from '../../routes/PrivateRoute'
import Route from '../../routes/Route'
import { ROUTE_EDIT_BOUNTY } from '../../routes/routes'
import { Nil } from '../../util/types'
import { BountyDto } from '../bounties.dto'
import BountyHeader from './BountyHeader'
import BountyEdit from './edit/BountyEdit'
import BountyInfo from './info/BountyInfo'

export enum BountyContentType {
    Info = 'info',
    // TODO add discussion
    // Discussion = 'discussion',
}

const BOUNTY_CONTENT_TYPE_BUILDER: { [key in BountyContentType]: BountyTabConfig } = {
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
    // TODO add discussion
    // [BountyContentType.Discussion]: {
    //     bountyContentType: BountyContentType.Discussion,
    //     translationKey: 'bounty.content.discussionLabel',
    //     svg: discussionIcon,
    //     getUrl: (baseUrl: string) => `${baseUrl}/${BountyContentType.Discussion}`,
    //     getRoute: (basePath: string, bounty: BountyDto) => (
    //         <Route key={BountyContentType.Discussion} exact={true} path={`${basePath}/${BountyContentType.Discussion}`}>
    //             <BountyDiscussion bounty={bounty} />
    //         </Route>
    //     ),
    // },
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
