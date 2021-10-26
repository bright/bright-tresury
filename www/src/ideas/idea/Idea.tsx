import React from 'react'
import { useParams } from 'react-router'
import { useNetworks } from '../../networks/useNetworks'
import Route from '../../routes/Route'
import { useGetIdea } from '../ideas.api'
import IdeaHeader from './IdeaHeader'
import { Switch, useRouteMatch } from 'react-router-dom'
import IdeaInfo from './info/IdeaInfo'
import IdeaDiscussion from './discussion/IdeaDiscussion'
import IdeaMilestones from './milestones/IdeaMilestones'
import LoadingWrapper from '../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useSuccessfullyLoadedItemStyles } from '../../components/loading/useSuccessfullyLoadedItemStyles'
import { IdeaDto, IdeaStatus } from '../ideas.dto'
import infoIcon from '../../assets/info.svg'
import milestonesIcon from '../../assets/milestones.svg'
import discussionIcon from '../../assets/discussion.svg'
import { Nil } from '../../util/types'

export enum IdeaContentType {
    Info = 'info',
    Milestones = 'milestones',
    Discussion = 'discussion',
}

const IDEA_CONTENT_TYPE_BUILDER: { [key in IdeaContentType]: IdeaTabConfig} = {
    [IdeaContentType.Info]: {
        ideaContentType: IdeaContentType.Info,
        translationKey: 'idea.content.infoLabel',
        svg: infoIcon,
        getUrl: (baseUrl: string) => `${baseUrl}/${IdeaContentType.Info}`,
        getRoute: (basePath: string, idea: IdeaDto) => (
            <Route key={IdeaContentType.Info} exact={true} path={`${basePath}/${IdeaContentType.Info}`}>
                <IdeaInfo idea={idea} />
            </Route>
        )
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
        )
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
    }
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
const Idea = ({idea}: IdeaProps) => {
    const classes = useSuccessfullyLoadedItemStyles()

    const { t } = useTranslation()
    let { path } = useRouteMatch()

    const ideaContentTypes = idea.status === IdeaStatus.Draft
        ? [IdeaContentType.Info, IdeaContentType.Milestones]
        : [IdeaContentType.Info, IdeaContentType.Milestones, IdeaContentType.Discussion]

    const ideaTabsConfig = ideaContentTypes.map((ideaContentType) => IDEA_CONTENT_TYPE_BUILDER[ideaContentType])
    const routes = ideaTabsConfig.map(({ getRoute }) => getRoute(path, idea))
debugger
    return (
        <div className={classes.root}>
            <IdeaHeader idea={idea} ideaTabsConfig={ideaTabsConfig} />
                <Switch>
                    <Route exact={true} path={path}>
                        <IdeaInfo idea={idea} />
                    </Route>
                    {routes}
                </Switch>
        </div>
    )
}

export default Idea
