import React from 'react'
import { useTranslation } from 'react-i18next'
import { Switch, useRouteMatch } from 'react-router-dom'
import discussionIcon from '../../assets/discussion.svg'
import infoIcon from '../../assets/info.svg'
import milestonesIcon from '../../assets/milestones.svg'
import { useSuccessfullyLoadedItemStyles } from '../../components/loading/useSuccessfullyLoadedItemStyles'
import PrivateRoute from '../../routes/PrivateRoute'
import Route from '../../routes/Route'
import { ROUTE_EDIT_IDEA, ROUTE_TURN_IDEA } from '../../routes/routes'
import { Nil } from '../../util/types'
import { IdeaDto, IdeaStatus } from '../ideas.dto'
import IdeaDiscussion from './discussion/IdeaDiscussion'
import IdeaHeader from './IdeaHeader'
import IdeaDetails from './info/IdeaDetails'
import IdeaEdit from './info/IdeaEdit'
import IdeaMilestones from './milestones/IdeaMilestones'
import TurnIdeaIntoProposal from './turnIntoProposal/TurnIdeaIntoProposal'

export enum IdeaContentType {
    Info = 'info',
    Milestones = 'milestones',
    Discussion = 'discussion',
}

const IDEA_CONTENT_TYPE_BUILDER: { [key in IdeaContentType]: IdeaTabConfig } = {
    [IdeaContentType.Info]: {
        ideaContentType: IdeaContentType.Info,
        translationKey: 'idea.content.infoLabel',
        svg: infoIcon,
        getUrl: (baseUrl: string) => `${baseUrl}/${IdeaContentType.Info}`,
        getRoute: (basePath: string, idea: IdeaDto) => (
            <Route key={IdeaContentType.Info} exact={true} path={`${basePath}/${IdeaContentType.Info}`}>
                <IdeaDetails idea={idea} />
            </Route>
        ),
    },
    [IdeaContentType.Milestones]: {
        ideaContentType: IdeaContentType.Milestones,
        translationKey: 'idea.content.milestonesLabel',
        svg: milestonesIcon,
        getUrl: (baseUrl: string) => `${baseUrl}/${IdeaContentType.Milestones}`,
        getRoute: (basePath: string, idea: IdeaDto) => (
            <Route key={IdeaContentType.Milestones} exact={true} path={`${basePath}/${IdeaContentType.Milestones}`}>
                <IdeaMilestones idea={idea} />
            </Route>
        ),
    },
    [IdeaContentType.Discussion]: {
        ideaContentType: IdeaContentType.Discussion,
        translationKey: 'idea.content.discussionLabel',
        svg: discussionIcon,
        getUrl: (baseUrl: string) => `${baseUrl}/${IdeaContentType.Discussion}`,
        getRoute: (basePath: string, idea: IdeaDto) => (
            <Route key={IdeaContentType.Discussion} exact={true} path={`${basePath}/${IdeaContentType.Discussion}`}>
                <IdeaDiscussion idea={idea} />
            </Route>
        ),
    },
}

export interface IdeaTabConfig {
    ideaContentType: IdeaContentType
    translationKey: string
    svg: string
    getUrl: (baseUrl: string) => string
    getRoute: (basePath: string, idea: IdeaDto) => JSX.Element
    notificationsCount?: Nil<number>
}
interface OwnProps {
    idea: IdeaDto
}
export type IdeaProps = OwnProps
const Idea = ({ idea }: IdeaProps) => {
    const classes = useSuccessfullyLoadedItemStyles()

    const { t } = useTranslation()
    let { path } = useRouteMatch()

    const ideaContentTypes =
        idea.status === IdeaStatus.Draft
            ? [IdeaContentType.Info, IdeaContentType.Milestones]
            : [IdeaContentType.Info, IdeaContentType.Milestones, IdeaContentType.Discussion]

    const ideaTabsConfig = ideaContentTypes.map((ideaContentType) => IDEA_CONTENT_TYPE_BUILDER[ideaContentType])
    const routes = ideaTabsConfig.map(({ getRoute }) => getRoute(path, idea))

    return (
        <div className={classes.root}>
            <Switch>
                <PrivateRoute requireVerified={true} exact={true} path={ROUTE_TURN_IDEA}>
                    <TurnIdeaIntoProposal idea={idea} />
                </PrivateRoute>
                <PrivateRoute requireVerified={true} exact={true} path={ROUTE_EDIT_IDEA}>
                    <IdeaEdit idea={idea} />
                </PrivateRoute>
                <>
                    <IdeaHeader idea={idea} ideaTabsConfig={ideaTabsConfig} />
                    <Switch>
                        <Route exact={true} path={path}>
                            <IdeaDetails idea={idea} />
                        </Route>
                        {routes}
                    </Switch>
                </>
            </Switch>
        </div>
    )
}

export default Idea
