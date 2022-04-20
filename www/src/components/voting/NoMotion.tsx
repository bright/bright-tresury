import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'
import { useTranslation } from 'react-i18next'
import proposalNoMotion from '../../assets/proposal_no_motion.svg'
import RouterLink from '../link/RouterLink'
import { useSuccessfullyLoadedItemStyles } from '../loading/useSuccessfullyLoadedItemStyles'

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
        description: {
            fontSize: '16px',
            marginLeft: '25%',
            marginRight: '25%',
        },
        image: {
            margin: '20px',
            paddingLeft: '35px',
            // height: '170px',
        },
        link: {
            margin: '20px',
            display: 'block',
        },
    }),
)

interface OwnProps {
    title: string
    description?: string
    toDiscussion: string
}

export type NoMotionProps = OwnProps

const NoMotion = ({ title, description, toDiscussion }: NoMotionProps) => {
    const { t } = useTranslation()
    const styles = useStyles()
    const successfullyLoadedItemStyles = useSuccessfullyLoadedItemStyles()

    return (
        <div className={`${styles.root} ${successfullyLoadedItemStyles.content}`}>
            <h3 className={styles.header}>{title}</h3>
            <p className={styles.description}>{description ?? t('voting.noMotion.description')}</p>
            <img className={styles.image} src={proposalNoMotion} alt={''} />
            <span className={styles.link}>
                <RouterLink to={toDiscussion}>{t('voting.noMotion.visitDiscussions')}</RouterLink>
            </span>
        </div>
    )
}

export default NoMotion
