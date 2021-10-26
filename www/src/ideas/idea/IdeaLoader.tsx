import React from 'react'
import { useParams } from 'react-router'
import { useNetworks } from '../../networks/useNetworks'
import { useGetIdea } from '../ideas.api'
import LoadingWrapper from '../../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'
import Idea from './Idea'


const IdeaLoader = () => {
    const { t } = useTranslation()
    let { ideaId } = useParams<{ ideaId: string }>()
    const { network } = useNetworks()
    const { status, data: idea } = useGetIdea({ ideaId, network: network.id })

    return (
        <LoadingWrapper
            status={status}
            errorText={t('errors.errorOccurredWhileLoadingIdea')}
            loadingText={t('loading.idea')}
        >
            {idea ? <Idea idea={idea}/> : null}
        </LoadingWrapper>
    )
}

export default IdeaLoader
