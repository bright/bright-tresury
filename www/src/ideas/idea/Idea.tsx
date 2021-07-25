import React from 'react'
import { useParams } from 'react-router'
import Route from '../../routes/Route'
import IdeaHeader from './IdeaHeader'
import { IdeaContentType } from './IdeaContentTypeTabs'
import { Switch, useRouteMatch } from 'react-router-dom'
import IdeaInfo from './info/IdeaInfo'
import { IdeaDiscussion } from './discussion/IdeaDiscussion'
import IdeaMilestones from './milestones/IdeaMilestones'
import LoadingWrapper from '../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useSuccessfullyLoadedItemStyles } from '../../components/loading/useSuccessfullyLoadedItemStyles'
import { useIdea } from './useIdea'

const Idea = () => {
    const classes = useSuccessfullyLoadedItemStyles()

    const { t } = useTranslation()

    let { path } = useRouteMatch()

    let { ideaId } = useParams<{ ideaId: string }>()

    const { status, idea, canEdit } = useIdea(ideaId)

    return (
        <LoadingWrapper
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingIdea')}
            loadingText={t('loading.idea')}
        >
            {idea ? (
                <div className={classes.root}>
                    <IdeaHeader idea={idea} canEdit={canEdit} />
                    <Switch>
                        <Route exact={true} path={path}>
                            <IdeaInfo idea={idea} canEdit={canEdit} />
                        </Route>
                        <Route exact={true} path={`${path}/${IdeaContentType.Info}`}>
                            <IdeaInfo idea={idea} canEdit={canEdit} />
                        </Route>
                        <Route exact={true} path={`${path}/${IdeaContentType.Milestones}`}>
                            <IdeaMilestones idea={idea} canEdit={canEdit} />
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
