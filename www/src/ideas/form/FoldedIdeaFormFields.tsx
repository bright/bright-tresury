import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import React from 'react';
import {useTranslation} from "react-i18next";
import {FormInput} from "../../components/input/FormInput";
import config from "../../config";
import {breakpoints} from "../../theme/theme";
import {IdeaDto, IdeaNetworkDto} from "../ideas.api";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        inputField: {
            marginTop: '2em'
        },
        smallField: {
            width: '50%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '100%',
            },
        },
        fieldSelect: {
            backgroundColor: theme.palette.background.default,
            fontWeight: 500
        },
    }),
);

interface Props {
    values: IdeaDto
}

const FoldedIdeaFormFields: React.FC<Props> = ({values}) => {
    const classes = useStyles()
    const {t} = useTranslation()
    return (
        <>
            <div className={classes.inputField}>
                <FormInput
                    name="title"
                    placeholder={t('idea.details.title')}
                    label={t('idea.details.title')}/>
            </div>
            <div className={`${classes.inputField} ${classes.smallField}`}>
                <FormInput
                    name="beneficiary"
                    placeholder={t('idea.details.beneficiary')}
                    label={t('idea.details.beneficiary')}
                />
            </div>
            {values.networks.map((network: IdeaNetworkDto, index: number) => {
                    return (<div className={`${classes.inputField} ${classes.smallField}`} key={network.name}>
                            <FormInput
                                name={`networks[${index}].value`}
                                type={`number`}
                                label={t('idea.details.reward')}
                                placeholder={t('idea.details.reward')}
                                endAdornment={config.NETWORK_CURRENCY}
                            />
                        </div>
                    )
                }
            )}
        </>
    );
}

export default FoldedIdeaFormFields
