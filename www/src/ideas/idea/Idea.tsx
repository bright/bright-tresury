import React, { useMemo } from 'react'
import { useParams } from 'react-router'
import { useAuth } from '../../auth/AuthContext'
import { useGetIdea } from '../ideas.api'
import IdeaHeader from './IdeaHeader'
import { IdeaContentType } from './IdeaContentTypeTabs'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { IdeaInfo } from './info/IdeaInfo'
import { IdeaDiscussion } from './discussion/IdeaDiscussion'
import { IdeaMilestones } from './milestones/IdeaMilestones'
import { LoadingWrapper } from '../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import { useSuccessfullyLoadedItemStyles } from '../../components/loading/useSuccessfullyLoadedItemStyles'

export const Idea = () => {
    const classes = useSuccessfullyLoadedItemStyles()

    const { t } = useTranslation()

    let { path } = useRouteMatch()

    let { ideaId } = useParams<{ ideaId: string }>()

    const { isUserSignedInAndVerified, user } = useAuth()

    const { status, data: idea } = useGetIdea(ideaId)

    const canEdit = useMemo(() => {
        return isUserSignedInAndVerified && idea?.ownerId === user?.id
    }, [isUserSignedInAndVerified, idea, user])

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
                            <IdeaDiscussion />
                        </Route>
                    </Switch>
                </div>
            ) : null}
        </LoadingWrapper>
    )
}
