import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {breakpoints} from "../../../theme/theme";
import {Placeholder} from "../../text/Placeholder";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'inline-block',
            fontSize: '18px',
            marginBottom: '16px',
            marginTop: 0,
            fontWeight: 700,
            width: '100%',
            maxHeight: '3em',
            textOverflow: `ellipsis`,
            overflow: `hidden`,
            [theme.breakpoints.up(breakpoints.tablet)]: {
                height: '3em',
                flex: 1,
                marginTop: '16px'
            },
        },
        titlePlaceholder: {
            fontSize: '18px',
            color: theme.palette.text.hint,
            fontWeight: 500
        },
    }))

interface Props {
    title?: string
}

export const TitleLabel: React.FC<Props> = ({title}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    return <p className={classes.root}>
        {title || <Placeholder className={classes.titlePlaceholder} value={t('proposal.list.card.titlePlaceholder')}/>}
    </p>
}
