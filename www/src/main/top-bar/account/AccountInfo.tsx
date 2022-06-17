import { Divider } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import arrowSvg from '../../../assets/account_menu_arrow.svg'
import { useAuth } from '../../../auth/AuthContext'
import IconButton from '../../../components/button/IconButton'
import { ROUTE_ACCOUNT, ROUTE_BOUNTIES, ROUTE_IDEAS, ROUTE_PROPOSALS, ROUTE_TIPS } from '../../../routes/routes'
import { useMenu } from '../../../hook/useMenu'
import EmailVerifyErrorMenuItem from './EmailVerifyErrorMenuItem'
import MenuItem from './MenuItem'
import SignOutMenuItem from './SignOutMenuItem'
import { IdeaFilter, IdeaFilterSearchParamName } from '../../../ideas/list/IdeaStatusFilters'
import { ProposalFilter, ProposalFilterSearchParamName } from '../../../proposals/useProposalsFilter'
import clsx from 'clsx'
import StyledAvatarContainer from './StyledAvatarContainer'
import { fromAuthContextUser } from '../../../util/publicUser.dto'
import UserAvatar from '../../../components/user/UserAvatar'
import { BountyFilter, BountyFilterSearchParamName } from '../../../bounties/useBountiesFilter'
import { TipFilter, TipFilterSearchParamName } from '../../../tips/list/useTipFilter'
import { useGetUserStatistics } from './useGetUserStatistics'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        avatar: {
            height: '28px',
            lineHeight: '28px',
            width: '28px',
            borderColor: theme.palette.primary.main,
            borderWidth: '1px',
        },
        styledBorder: {
            borderRadius: '8px',
            borderStyle: 'solid',
        },
    }),
)

const MY_ACCOUNT = ROUTE_ACCOUNT
const MINE_IDEAS = `${ROUTE_IDEAS}?${IdeaFilterSearchParamName}=${IdeaFilter.Mine}`
const MINE_PROPOSALS = `${ROUTE_PROPOSALS}?${ProposalFilterSearchParamName}=${ProposalFilter.Mine}`
const MINE_BOUNTIES = `${ROUTE_BOUNTIES}?${BountyFilterSearchParamName}=${BountyFilter.Mine}`
const MINE_TIPS = `${ROUTE_TIPS}?${TipFilterSearchParamName}=${TipFilter.Mine}`

const AccountInfo = () => {
    const { t } = useTranslation()
    const classes = useStyles()
    const history = useHistory()
    const { user } = useAuth()
    const { data: userStatistics, refetch } = useGetUserStatistics()
    const { ideas = 0, proposals = 0, bounties = 0, tips = 0 } = userStatistics ?? {}
    const address = user?.web3Addresses.find((address) => address.isPrimary)?.encodedAddress ?? ''

    const { anchorEl, open, handleClose, handleOpen } = useMenu()
    const openMenu = (event?: React.MouseEvent<HTMLElement>) => {
        refetch()
        handleOpen(event)
    }

    const goToPath = (path: string) => {
        history.push(path)
        handleClose()
    }

    return (
        <div className={classes.root}>
            <StyledAvatarContainer>
                <UserAvatar
                    className={clsx(classes.avatar, address ? classes.styledBorder : null)}
                    user={fromAuthContextUser(user!)}
                    size={26}
                />
            </StyledAvatarContainer>
            <IconButton onClick={openMenu} alt={t('topBar.showAccountMenu')} svg={arrowSvg} />
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
                <MenuItem onClick={() => goToPath(MY_ACCOUNT)}>{t('topBar.account.account')}</MenuItem>
                <MenuItem onClick={() => goToPath(MINE_IDEAS)}>
                    {t('topBar.account.yourIdeas')} ({ideas})
                </MenuItem>
                <MenuItem onClick={() => goToPath(MINE_PROPOSALS)}>
                    {t('topBar.account.yourProposals')} ({proposals})
                </MenuItem>
                <MenuItem onClick={() => goToPath(MINE_BOUNTIES)}>
                    {t('topBar.account.yourBounties')} ({bounties})
                </MenuItem>
                <MenuItem onClick={() => goToPath(MINE_TIPS)}>
                    {t('topBar.account.yourTips')} ({tips})
                </MenuItem>
                <Divider />
                <SignOutMenuItem />
            </Menu>
        </div>
    )
}

export default AccountInfo
