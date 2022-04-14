import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React, { PropsWithChildren, ReactNode } from 'react'
import { breakpoints } from '../../../theme/theme'
import { Nil } from '../../../util/types'
import InformationTip from '../../info/InformationTip'
import { ClassNameProps } from '../../props/className.props'

const useStyles = makeStyles((theme) =>
    createStyles({
        value: {
            width: '164px',
            marginRight: '52px',
        },
        content: {
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'column',
                alignItems: 'flex-start',
            },
        },
        tip: {
            marginTop: '8px',
            marginBottom: '8px',
        },
    }),
)

interface OwnProps {
    tipLabel?: Nil<ReactNode>
}

export type WithInformationTipProps = PropsWithChildren<OwnProps> & ClassNameProps

const WithInformationTip = ({ tipLabel, className, children }: WithInformationTipProps) => {
    const classes = useStyles()

    return (
        <div className={clsx(className, classes.content)}>
            {children}
            {tipLabel ? <InformationTip className={classes.tip} label={tipLabel} /> : null}
        </div>
    )
}

export default WithInformationTip
