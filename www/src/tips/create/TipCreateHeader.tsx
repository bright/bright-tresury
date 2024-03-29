import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { Trans } from 'react-i18next'
import InformationTip from '../../components/info/InformationTip'
import TipCreateSwitch, { TipCreateMode } from './TipCreateSwitch'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop: '40px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            justifyContent: 'flex-end',
        },
        switch: {
            flexGrow: 1,
        },
    }),
)

interface OwnProps {
    mode: TipCreateMode
    setMode: (mode: TipCreateMode) => void
}

export type TipCreateHeaderProps = OwnProps

const TipCreateHeader = ({ mode, setMode }: TipCreateHeaderProps) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <TipCreateSwitch mode={mode} setMode={setMode} className={classes.switch} />
        </div>
    )
}

export default TipCreateHeader
