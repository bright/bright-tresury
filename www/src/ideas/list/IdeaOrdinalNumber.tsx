import React from "react";
import {Trans} from "react-i18next";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Strong} from "../../components/info/Info";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            fontSize: 18
        }
    })
)

interface Props {
    ordinalNumber: number
}

export const IdeaOrdinalNumber: React.FC<Props> = ({ordinalNumber}) => {
    const classes = useStyles()
    return <div className={classes.root}>
        <Trans i18nKey="idea.list.card.ideaNumber"
               values={{ordinalNumber}}
               components={{strong: <Strong/>}}
        />
    </div>
}
