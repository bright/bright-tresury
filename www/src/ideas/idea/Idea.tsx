import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import { useParams } from 'react-router'
import { useAuth } from '../../auth/AuthContext'
import { useGetIdea } from '../ideas.api'
import IdeaHeader from './IdeaHeader'
import { IdeaContentType } from './IdeaContentTypeTabs'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { IdeaInfo } from './info/IdeaInfo'
import { IdeaDiscussion } from './discussion/IdeaDiscussion'
import { breakpoints } from '../../theme/theme'
import { IdeaMilestones } from './milestones/IdeaMilestones'
import { LoadingWrapper } from '../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'

export const useIdeaStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        },
        content: {
            padding: '2.5em 5em 3em 3em',
            background: theme.palette.background.paper,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                padding: '2em 1.5em 3em 1.5em',
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '1em 1.5em 4em 1em',
            },
        },
    }),
)

export const Idea = () => {
    const classes = useIdeaStyles()

    const { t } = useTranslation()

    let { path } = useRouteMatch()

    let { ideaId } = useParams<{ ideaId: string }>()

    const { isUserVerified, user } = useAuth()

    const { status, data: idea } = useGetIdea(ideaId)

    const canEdit = useMemo(() => {
        return isUserVerified && idea?.ownerId === user?.id
    }, [idea, isUserVerified, user])

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
