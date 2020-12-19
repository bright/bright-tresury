import React from 'react';
import {Header} from "../../components/header/Header";
import {IconButton} from "../../components/button/IconButton";
import CrossSvg from "../../assets/cross.svg";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {ROUTE_IDEAS} from "../../routes";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        headerContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignContent: 'center'
        },
    }),
);

interface Props {
    isNewIdea: boolean
}

const IdeaFormHeader: React.FC<Props> = ({isNewIdea}) => {
    const classes = useStyles()
    const {t} = useTranslation()
    const history = useHistory()

    const navigateToList = () => {
        history.push(ROUTE_IDEAS)
    }

    return <div className={classes.headerContainer}>
        <Header>
            {t(isNewIdea ? 'idea.introduceTitle' : 'idea.editTitle')}
        </Header>
        <IconButton svg={CrossSvg} onClick={navigateToList}/>
    </div>
}

export default IdeaFormHeader
