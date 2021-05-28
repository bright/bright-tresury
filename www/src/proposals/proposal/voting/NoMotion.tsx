import React from 'react'
import { useTranslation } from 'react-i18next'
import proposalNoMotion from '../../../assets/proposal_no_motion.svg'
import { RouterLink } from '../../../components/link/RouterLink'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { generatePath, useRouteMatch } from 'react-router-dom'
import { ROUTE_PROPOSAL } from '../../../routes/routes'
import { ProposalContentType } from '../ProposalContentTypeTabs'
import { useSuccessfullyLoadedItemStyles } from '../../../components/loading/useSuccessfullyLoadedItemStyles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            textAlign: 'center',
        },
        header: {
            fontSize: '18px',
            margin: '20px',
        },
        body: {
            fontSize: '16px',
        },
        image: {
            margin: '20px',
            paddingLeft: '35px',
        },
        link: {
            margin: '20px',
            display: 'block',
        },
    }),
)

interface NoMotionProps {
    proposalIndex: number
}

const NoMotion = ({ proposalIndex }: NoMotionProps) => {
    const { t } = useTranslation()
    const styles = useStyles()
    const successfullyLoadedItemStyles = useSuccessfullyLoadedItemStyles()
    const toDiscussion = `${generatePath(ROUTE_PROPOSAL, { proposalIndex })}/${ProposalContentType.Discussion}`
    return (
        <div className={`${styles.root} ${successfullyLoadedItemStyles.content}`}>
            <h3 className={styles.header}>{t('proposal.voting.noMotion.title')}</h3>
            <p className={styles.body}>
                {t('proposal.voting.noMotion.body1')}
                <br />
                {t('proposal.voting.noMotion.body2')}
            </p>
            <img className={styles.image} src={proposalNoMotion} alt={''} />
            <span className={styles.link}>
                <RouterLink to={toDiscussion}>{t('proposal.voting.noMotion.visitDiscussions')}</RouterLink>
            </span>
        </div>
    )
}

export default NoMotion
