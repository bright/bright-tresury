import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../theme/theme";
import {Placeholder} from "../text/Placeholder";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'inline-block',
            fontWeight: 700,
            width: '100%',
            maxHeight: '3em',
            textOverflow: `ellipsis`,
            overflow: `hidden`,
            [theme.breakpoints.up(breakpoints.tablet)]: {
                maxHeight: '3em',
                flex: 1,
            },
        },
        titlePlaceholder: {
            color: theme.palette.text.hint,
            fontWeight: 500
        },
    }))

interface Props {
    title?: string
}

export const OptionalTitle: React.FC<Props> = ({title}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    return <div className={classes.root}>
        {title || <Placeholder className={classes.titlePlaceholder} value={t('proposal.list.card.titlePlaceholder')}/>}
    </div>
}
