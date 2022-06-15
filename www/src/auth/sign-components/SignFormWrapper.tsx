import React, { PropsWithChildren } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles<Theme, SignFormWrapperStylesProps>(() =>
    createStyles({
        form: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: ({ variant }) => (variant === 'center' ? 'center' : 'flex-start'),
        },
    }),
)

interface OwnProps {
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void
}

export interface SignFormWrapperStylesProps {
    variant?: 'left' | 'center'
}

export type SignFormWrapperProps = PropsWithChildren<OwnProps & SignFormWrapperStylesProps>

export const SignFormWrapper = ({ handleSubmit, variant = 'center', children }: SignFormWrapperProps) => {
    const classes = useStyles({ variant })

    return (
        <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
            {children}
        </form>
    )
}
