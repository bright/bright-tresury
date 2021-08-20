import React from 'react'
import { useParams } from 'react-router'
import { useNetworks } from '../../networks/useNetworks'
import Route from '../../routes/Route'
import { useGetIdea } from '../ideas.api'
import IdeaHeader from './IdeaHeader'
import { IdeaContentType } from './IdeaContentTypeTabs'
import { Switch, useRouteMatch } from 'react-router-dom'
import IdeaInfo from './info/IdeaInfo'
import IdeaDiscussion from './discussion/IdeaDiscussion'
import IdeaMilestones from './milestones/IdeaMilestones'
import LoadingWrapper from '../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useSuccessfullyLoadedItemStyles } from '../../components/loading/useSuccessfullyLoadedItemStyles'

const Idea = () => {
    const classes = useSuccessfullyLoadedItemStyles()

    const { t } = useTranslation()

    let { path } = useRouteMatch()

    let { ideaId } = useParams<{ ideaId: string }>()

    const { network } = useNetworks()
    const { status, data: idea } = useGetIdea({ ideaId, network: network.id })

    return (
        <LoadingWrapper
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingIdea')}
            loadingText={t('loading.idea')}
        >
            {idea ? (
                <div className={classes.root}>
                    <IdeaHeader idea={idea} />
                    <Switch>
                        <Route exact={true} path={path}>
                            <IdeaInfo idea={idea} />
                        </Route>
                        <Route exact={true} path={`${path}/${IdeaContentType.Info}`}>
                            <IdeaInfo idea={idea} />
                        </Route>
                        <Route exact={true} path={`${path}/${IdeaContentType.Milestones}`}>
                            <IdeaMilestones idea={idea} />
                        </Route>
                        <Route exact={true} path={`${path}/${IdeaContentType.Discussion}`}>
                            <IdeaDiscussion ideaId={idea.id} />
                        </Route>
                    </Switch>
                </div>
            ) : null}
        </LoadingWrapper>
    )
}

export default Idea
