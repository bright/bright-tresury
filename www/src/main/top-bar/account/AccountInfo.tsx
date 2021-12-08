import { Divider } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import arrowSvg from '../../../assets/account_menu_arrow.svg'
import { useAuth } from '../../../auth/AuthContext'
import IconButton from '../../../components/button/IconButton'
import { useNetworks } from '../../../networks/useNetworks'
import { ROUTE_ACCOUNT, ROUTE_IDEAS, ROUTE_PROPOSALS } from '../../../routes/routes'
import { useMenu } from '../../../hook/useMenu'
import AccountImage from './AccountImage'
import EmailVerifyErrorMenuItem from './EmailVerifyErrorMenuItem'
import MenuItem from './MenuItem'
import SignOutMenuItem from './SignOutMenuItem'
import { IdeaFilter, IdeaFilterSearchParamName } from '../../../ideas/list/IdeaStatusFilters'
import { useGetIdeas } from '../../../ideas/ideas.api'
import { filterIdeas } from '../../../ideas/list/filterIdeas'
import { useGetProposals } from '../../../proposals/proposals.api'
import { filterProposals } from '../../../proposals/list/filterProposals'
import { ProposalFilter } from '../../../proposals/list/ProposalStatusFilters'
import { TimeFrame } from '../../../components/select/TimeSelect'
import { ProposalDto } from '../../../proposals/proposals.dto'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
        },
    }),
)

const AccountInfo = () => {
    const { t } = useTranslation()
    const classes = useStyles()
    const history = useHistory()
    const { user } = useAuth()
    const { network } = useNetworks()
    const { data: ideas } = useGetIdeas(network.id)
    const {data} = useGetProposals(network.id, TimeFrame.OnChain, 100)
    const proposals = data?.pages.map(page => page.items).flat() ?? []

    const { anchorEl, open, handleClose, handleOpen } = useMenu()

    const numberOfMineIdeas = useMemo(() => {
        const mineIdeas = ideas ? filterIdeas(ideas, IdeaFilter.Mine, user) : []
        return mineIdeas.length
    }, [ideas, user])

    const numberOfMineProposals = useMemo(() => {
        const mineProposals = proposals ? filterProposals(proposals, ProposalFilter.Mine, user) : []
        return mineProposals.length
    }, [proposals, user])

    const goToAccount = () => {
        history.push(ROUTE_ACCOUNT)
        handleClose()
    }

    const goToMineIdeas = () => {
        history.push(`${ROUTE_IDEAS}?${IdeaFilterSearchParamName}=${IdeaFilter.Mine}`)
        handleClose()
    }

    const goToMineProposals = () => {
        history.push(`${ROUTE_PROPOSALS}?${IdeaFilterSearchParamName}=${ProposalFilter.Mine}`)
        handleClose()
    }

    return (
        <div className={classes.root}>
            <AccountImage />
            <IconButton onClick={handleOpen} alt={t('topBar.showAccountMenu')} svg={arrowSvg} />
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                {user && !user.isEmailVerified ? (
                    <>
                        <EmailVerifyErrorMenuItem />
                        <Divider />
                    </>
                ) : null}
                <MenuItem onClick={goToAccount}>{t('topBar.account.account')}</MenuItem>
                <MenuItem onClick={goToMineIdeas}>
                    {t('topBar.account.yourIdeas')} ({numberOfMineIdeas})
                </MenuItem>
                <MenuItem onClick={goToMineProposals}>
                    {t('topBar.account.yourProposals')} ({numberOfMineProposals})
                </MenuItem>
                <Divider />
                <SignOutMenuItem />
            </Menu>
        </div>
    )
}

export default AccountInfo
