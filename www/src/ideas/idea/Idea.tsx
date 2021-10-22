import React, { Component } from 'react'
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

export enum IdeaContentType {
    Info = 'info',
    Milestones = 'milestones',
    Discussion = 'discussion',
}

export interface IdeaTabConfig {
    ideaContentType: IdeaContentType
    translation: string
    svg: string
    url: string
    route: JSX.Element
}

const Idea = () => {
    const classes = useSuccessfullyLoadedItemStyles()

    const { t } = useTranslation()

    let { path, url } = useRouteMatch()

    let { ideaId } = useParams<{ ideaId: string }>()

    const { network } = useNetworks()
    const { status, data: idea } = useGetIdea({ ideaId, network: network.id })

    const buildIdeaTabsConfig = (idea: IdeaDto) => {
        const makeRoute = (key: IdeaContentType, jsxElement: JSX.Element) => (
            <Route key={key} exact={true} path={`${path}/${key}`}>
                {jsxElement}
            </Route>
        )
        const makeIdeaTabConfig = (
            ideaContentType: IdeaContentType,
            translationKey: string,
            svg: string,
            jsxElement: JSX.Element,
        ) => ({
            ideaContentType,
            translation: t(translationKey),
            svg,
            url: `${url}/${ideaContentType}`,
            route: makeRoute(ideaContentType, jsxElement),
        })
        const ideaTabsConfig: IdeaTabConfig[] = [
            makeIdeaTabConfig(IdeaContentType.Info, 'idea.content.infoLabel', infoIcon, <IdeaInfo idea={idea} />),
            makeIdeaTabConfig(
                IdeaContentType.Milestones,
                'idea.content.milestonesLabel',
                milestonesIcon,
                <IdeaMilestones idea={idea} />,
            ),
        ]
        if (idea.status !== IdeaStatus.Draft)
            ideaTabsConfig.push(
                makeIdeaTabConfig(
                    IdeaContentType.Discussion,
                    'idea.content.discussionLabel',
                    discussionIcon,
                    <IdeaDiscussion idea={idea} />,
                ),
            )
        return ideaTabsConfig
    }
    return (
        <LoadingWrapper
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingIdea')}
            loadingText={t('loading.idea')}
        >
            {idea
                ? (() => {
                      const ideaTabsConfig = buildIdeaTabsConfig(idea)
                      const routes = ideaTabsConfig.map(({ route }) => route)
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
                  })()
                : null}
        </LoadingWrapper>
    )
}

export default Idea
