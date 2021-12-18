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

interface OwnProps {
    title: string
    toDiscussion: string
}

export type NoMotionProps = OwnProps

const NoMotion = ({ title, toDiscussion }: NoMotionProps) => {
    const { t } = useTranslation()
    const styles = useStyles()
    const successfullyLoadedItemStyles = useSuccessfullyLoadedItemStyles()

    return (
        <div className={`${styles.root} ${successfullyLoadedItemStyles.content}`}>
            <h3 className={styles.header}>{title}</h3>
            <p className={styles.body}>
                {t('voting.noMotion.body1')}
                <br />
                {t('voting.noMotion.body2')}
            </p>
            <img className={styles.image} src={proposalNoMotion} alt={''} />
            <span className={styles.link}>
                <RouterLink to={toDiscussion}>{t('voting.noMotion.visitDiscussions')}</RouterLink>
            </span>
        </div>
    )
}

export default NoMotion
