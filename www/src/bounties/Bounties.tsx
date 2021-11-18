import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import BountiesHeader from './BountiesHeader'
import BountiesList from './list/BountiesList'
import { useGetBounties } from './bounties.api'
import { useNetworks } from '../networks/useNetworks'
import LoadingWrapper from '../components/loading/LoadingWrapper'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
        },
    }),
)

const Bounties = () => {
    const classes = useStyles()
    const { t } = useTranslation()
    const { network } = useNetworks()

    const { status, data: bounties, refetch } = useGetBounties(network.id)

    return (
        <div className={classes.root}>
            <BountiesHeader />
            <LoadingWrapper
                status={status}
                errorText={t('errors.errorOccurredWhileLoadingBounties')}
                loadingText={t('loading.bounties')}
            >
                <BountiesList bounties={bounties} />
            </LoadingWrapper>
        </div>
    )
}

export default Bounties
