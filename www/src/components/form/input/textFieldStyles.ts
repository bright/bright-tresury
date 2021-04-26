import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/core";

export enum TextFieldColorScheme {
    Light = 'light',
    Dark = 'dark'
}

interface StylesProps {
    colorScheme: TextFieldColorScheme
}

export const useTextFieldStyles = makeStyles<Theme, StylesProps>(theme =>
    createStyles({
        root: {
            backgroundColor: props =>
                props.colorScheme === TextFieldColorScheme.Light ? theme.palette.background.default : theme.palette.background.paper,
            padding: '0'
        },
        input: {
            backgroundColor: props =>
                props.colorScheme === TextFieldColorScheme.Light ? theme.palette.background.default : theme.palette.background.paper,
            border: props =>
                `solid 1px ${props.colorScheme === TextFieldColorScheme.Light ? theme.palette.background.default : theme.palette.background.paper}`,
            fontSize: '14px',
            padding: '1em',
            fontWeight: 500
        },
        adornedEnd: {
            paddingRight: '1.5em'
        },
        error: {
            '& input': {
                borderColor: theme.palette.error.main
            },
        },
    }),
);
