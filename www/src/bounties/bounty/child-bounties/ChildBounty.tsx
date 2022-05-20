import React from 'react'
import { Switch, useRouteMatch } from 'react-router-dom'
import infoIcon from '../../../assets/info.svg'
import { ChildBountyDto } from './child-bounties.dto'
import ChildBountyInfo from './info/ChildBountyInfo'
import Route from '../../../routes/Route'
import { Nil } from '../../../util/types'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'
import ChildBountyHeader from './header/ChildBountyHeader'

export enum ChildBountyContentType {
    Info = 'info',
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

    return (
        <div className={classes.root}>
            <Switch>
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
