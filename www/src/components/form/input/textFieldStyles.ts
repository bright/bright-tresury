import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export enum TextFieldColorScheme {
    Light = 'light',
    Dark = 'dark'
}

interface StylesProps {
    colorScheme: TextFieldColorScheme
}

export const useTextFieldStyles = (props: StylesProps) => makeStyles<Theme>(theme =>
    createStyles({
        root: {
            backgroundColor: props.colorScheme === TextFieldColorScheme.Light ? theme.palette.background.default : theme.palette.background.paper,
            padding: '0'
        },
        input: {
            backgroundColor: props.colorScheme === TextFieldColorScheme.Light ? theme.palette.background.default : theme.palette.background.paper,
            borderColor: props.colorScheme === TextFieldColorScheme.Light ? theme.palette.background.default : theme.palette.background.paper,
            borderStyle: 'solid',
            borderWidth: '1px',
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
