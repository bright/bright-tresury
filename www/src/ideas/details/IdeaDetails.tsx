import React, {useMemo} from "react";
import {IdeaDto} from "../ideas.api";
import {useTranslation} from "react-i18next";
import {Label} from "../../components/text/Label";
import {Identicon} from "../../components/identicon/Identicon";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Link} from "../../components/link/Link";
import {breakpoints} from "../../theme/theme";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        text: {
            fontSize: '14px',
            fontWeight: 500,
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '18px'
            },
            [theme.breakpoints.down(breakpoints.tablet)]: {
                fontSize: '16px'
            }
        },
        longText: {
            padding: '20px',
            backgroundColor: theme.palette.background.default,
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 400,
            width: '70%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
                padding: '16px',
                fontSize: '18px'
            },
            [theme.breakpoints.down(breakpoints.mobile)]: {
                padding: '10px',
                fontSize: '14px'
            },
        },
        spacing: {
            marginTop: '2em'
        },
        beneficiary: {
            display: 'flex',
            alignItems: 'center'
        },
        beneficiaryValue: {
            marginLeft: '.5em',
        },
        linkSpacing: {
            marginTop: '.7em'
        }
    }),
);

interface Props {
    idea: IdeaDto
}

const IdeaDetails: React.FC<Props> = ({idea}) => {
    const classes = useStyles()
    const {t} = useTranslation()

    const defaultValue = t('idea.details.defaultValue')

    const nonEmptyLinks = useMemo(
        () => idea.links ? idea.links.filter((link: string) => !!link) : [],
        [idea.links]
    )

    return <div>
        <Label label={t('idea.details.beneficiary')}/>
        <div className={classes.beneficiary}>
            <Identicon account={idea.beneficiary}/>
            <div className={`${classes.beneficiaryValue} ${classes.text}`}>
                {idea.beneficiary || defaultValue}
            </div>
        </div>
        <div className={classes.spacing}>
            <Label label={t('idea.details.field')}/>
            <div className={classes.text}>
                {idea.field || defaultValue}
            </div>
        </div>
        <div className={classes.spacing}>
            <Label label={t('idea.details.content')}/>
            <div className={classes.longText}>
                {idea.content || defaultValue}
            </div>
        </div>
        <div className={classes.spacing}>
            <Label label={t('idea.details.contact')}/>
            <div className={classes.longText}>
                {idea.contact || defaultValue}
            </div>
        </div>
        <div className={classes.spacing}>
            <Label label={t('idea.details.portfolio')}/>
            <div className={classes.longText}>
                {idea.portfolio || defaultValue}
            </div>
        </div>
        <div className={classes.spacing}>
            <Label label={t('idea.details.links')}/>
            {nonEmptyLinks.length > 0 ? nonEmptyLinks.map((link: string, index: number) =>
                    <div className={index !== 0 ? classes.linkSpacing : ''}>
                        <Link href={link} key={index}/>
                    </div>)
                : <div className={classes.text}>{defaultValue}</div>
            }
        </div>
    </div>
}

export default IdeaDetails
