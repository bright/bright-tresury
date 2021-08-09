import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

export enum TextFieldColorScheme {
    Light = 'light',
    Dark = 'dark',
}

export interface TextFieldStylesProps {
    colorScheme?: TextFieldColorScheme
}

export const useTextFieldStyles = ({ colorScheme = TextFieldColorScheme.Light }: TextFieldStylesProps) =>
    makeStyles<Theme>((theme) =>
        createStyles({
            root: {
                backgroundColor:
                    colorScheme === TextFieldColorScheme.Light
                        ? theme.palette.background.default
                        : theme.palette.background.paper,
                padding: '0',
                borderColor: theme.palette.background.paper,
                borderStyle: 'solid',
                borderWidth: '1px',
                borderRadius: 0,
            },
            input: {
                backgroundColor:
                    colorScheme === TextFieldColorScheme.Light
                        ? theme.palette.background.default
                        : theme.palette.background.paper,
                borderColor: theme.palette.background.paper,
                borderStyle: 'solid',
                borderRightWidth: '1px',
                fontSize: '14px',
                padding: '1em',
                fontWeight: 500,
            },
            adornedEnd: {
                borderRadius: 0,
                paddingRight: '1em',
            },
            error: {
                '& input': {
                    borderWidth: '1px',
                    borderColor: theme.palette.error.main,
                },
            },
        }),
    )
