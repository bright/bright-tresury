import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {createStyles, Theme} from "@material-ui/core";
import menuDrawing from "../../assets/menu_drawing.svg"
import treasuryLabeledLogo from "../../assets/treasury_labeled_logo.svg"
import {useTranslation} from "react-i18next";
import {Button} from "../../components/button/Button";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        marginTop: 32,
        marginBottom: 32,
        padding: '32px 32px 0 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    drawing: {
        width: '100%'
    },
    whatForLabel: {
        fontSize: 14,
        marginTop: 16,
    },
    learnMoreButton: {
        marginTop: 20
    },
    logo: {
        marginTop: 30,
        width: '100%',
        height: 32
    }
}))

const MenuAppInfo: React.FC<{}> = () => {
    const classes = useStyles()
    const {t} = useTranslation()

    return <div className={classes.root}>
        <img className={classes.drawing} src={menuDrawing}/>
        <div className={classes.whatForLabel}>
            {t('menu.whatForLabel')}
        </div>
        {/*TODO: add learn more behaviour*/}
        <Button className={classes.learnMoreButton}
                variant="contained"
                color="secondary">
            {t('menu.learnMoreLabel')}
        </Button>
        <img className={classes.logo} src={treasuryLabeledLogo}/>
    </div>
}

export default MenuAppInfo
