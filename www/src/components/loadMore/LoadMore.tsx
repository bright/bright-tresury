import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import Button, { SuccessButton } from '../button/Button'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            textAlign: 'center'
        },
        button: {
            marginBottom: '20px'
        }
    }),
)

interface OwnProps {
    disabled: boolean,
    onClick: () => any
}

export type LoadMoreProps = OwnProps

const LoadMore = ({disabled, onClick}: LoadMoreProps) => {
    const styles = useStyles()
    const {t} = useTranslation()
    return (
        <div className={styles.root}>
            <Button
                color="primary"
                disabled={disabled}
                className={styles.button}
                onClick={onClick}
            >
                {t('components.loadMore')}
            </Button>
        </div>
    )
}
export default LoadMore
