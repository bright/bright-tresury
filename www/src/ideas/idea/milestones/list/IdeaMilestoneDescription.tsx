import React from "react";
import {Placeholder} from "../../../../components/text/Placeholder";
import {Nil} from "../../../../util/types";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {createStyles, Theme} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        fontSize: '16px'
    },
    description: {
        display: '-webkit-box',
        '-webkit-line-clamp': '2',
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    descriptionPlaceholder: {
        color: theme.palette.text.hint,
        fontWeight: 500
    },
}))

interface Props {
    description: Nil<string>
}

export const IdeaMilestoneDescription = ({ description }: Props) => {

    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.root}>
            { description
                ? (
                    <div className={classes.description}>
                        {description}
                    </div>
                )
                : (
                    <Placeholder
                        className={classes.descriptionPlaceholder}
                        value={t('idea.milestones.list.card.noDescriptionProvided')}
                    />
                )
            }
        </div>
    )
}