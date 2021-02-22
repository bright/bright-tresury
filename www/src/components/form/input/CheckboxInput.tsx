import {createStyles} from "@material-ui/core";
import Checkbox, {CheckboxProps} from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import {makeStyles, Theme} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useField} from "formik";
import {FieldHookConfig} from "formik/dist/Field";
import React from "react";
import {useTranslation} from "react-i18next";
import checkboxCheckedIcon from "../../../assets/checkbox_checked.svg"
import checkboxEmptyIcon from "../../../assets/checkbox_empty.svg"
import {ErrorLabel} from "./ErrorLabel";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginBottom: '5px',
        },
        label: {
            marginLeft: '12px',
            color: theme.palette.text.primary,
            fontSize: '12px',
        },
        errorLabel: {
            marginTop: '5px'
        }
    }),
);

const useCheckboxStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '0 0 0 10px',
        },
    }),
);

interface OwnProps {
    label: string | JSX.Element
}

export type CheckboxInputProps = OwnProps & CheckboxProps & FieldHookConfig<any>

export const CheckboxInput: React.FC<CheckboxInputProps> = ({label, ...props}) => {
    const classes = useStyles()
    const checkboxClasses = useCheckboxStyles()
    const {t} = useTranslation()

    const [field, meta] = useField({...props});
    const hasError: boolean = meta.touched && Boolean(meta.error)

    return <FormControl error={hasError} component="fieldset">
        <FormGroup>
            <FormControlLabel
                className={classes.root}
                control={<Checkbox
                    {...props}
                    classes={checkboxClasses}
                    checked={field.value}
                    inputProps={{...field, ...meta}}
                    icon={<img src={checkboxEmptyIcon} alt={t('form.inputs.checkbox.notChecked')}/>}
                    checkedIcon={<img src={checkboxCheckedIcon} alt={t('form.inputs.checkbox.checked')}/>}
                />}
                label={<Typography className={classes.label}>{label}</Typography>}
            />
        </FormGroup>
        <ErrorLabel className={classes.errorLabel} touched={meta.touched} errorMessage={meta.error}/>
    </FormControl>
}
