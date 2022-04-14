import React from 'react'
import discussionIcon from '../../assets/discussion.svg'
import infoIcon from '../../assets/info.svg'
import Route from '../../routes/Route'
import { Nil } from '../../util/types'
import { Switch, useRouteMatch } from 'react-router-dom'
import { useSuccessfullyLoadedItemStyles } from '../../components/loading/useSuccessfullyLoadedItemStyles'
import TipDiscussion from './discussion/TipDiscussion'
import TipHeader from './TipHeader'
import TipInfo from './TipInfo'
import { TipDto } from '../tips.dto'

export enum TipContentType {
    Info = 'info',
    Discussion = 'discussion',
}

const TIP_CONTENT_TYPE_BUILDER: { [key in TipContentType]: TipTabConfig } = {
    [TipContentType.Info]: {
        tipContentType: TipContentType.Info,
        translationKey: 'tip.content.infoLabel',
        svg: infoIcon,
        getUrl: (baseUrl: string) => `${baseUrl}/${TipContentType.Info}`,
        getRoute: (basePath: string, tip: TipDto) => (
            <Route key={TipContentType.Info} exact={true} path={`${basePath}/${TipContentType.Info}`}>
                <TipInfo tip={tip} />
            </Route>
        ),
        isDefault: true,
    },
    [TipContentType.Discussion]: {
        tipContentType: TipContentType.Discussion,
        translationKey: 'tip.content.discussionLabel',
        svg: discussionIcon,
        getUrl: (baseUrl: string) => `${baseUrl}/${TipContentType.Discussion}`,
        getRoute: (basePath: string, tip: TipDto) => (
            <Route key={TipContentType.Discussion} exact={true} path={`${basePath}/${TipContentType.Discussion}`}>
                <TipDiscussion tip={tip} />
            </Route>
        ),
    },
}

export interface TipTabConfig {
    tipContentType: TipContentType
    translationKey: string
    svg: string
    getUrl: (baseUrl: string) => string
    getRoute: (basePath: string, bounty: TipDto) => JSX.Element
    notificationsCount?: Nil<number>
    isDefault?: boolean
}

interface OwnProps {
    tip: TipDto
}

export type TipProps = OwnProps

const Tip = ({ tip }: TipProps) => {
    const classes = useSuccessfullyLoadedItemStyles()

    let { path } = useRouteMatch()

    const tipTabsConfig = Object.values(TIP_CONTENT_TYPE_BUILDER)
    const routes = tipTabsConfig.map(({ getRoute }) => getRoute(path, tip))

    return (
        <div className={classes.root}>
            <Switch>
                <>
                    <TipHeader tip={tip} tipTabsConfig={tipTabsConfig} />
                    <Switch>
                        <Route exact={true} path={path}>
                            <TipInfo tip={tip} />
                        </Route>
                        {routes}
                    </Switch>
                </>
            </Switch>
        </div>
    )
}

export default Tip
