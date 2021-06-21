import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { breakpoints } from '../../../theme/theme'
import React from 'react'
import Radio from '../../../components/radio/Radio'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        title: {
            marginBottom: '32px',
        },
        web3Element: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: '50px',
            width: '100%',
            [theme.breakpoints.down(breakpoints.mobile)]: {
                flexDirection: 'column-reverse',
                alignItems: 'flex-start',
                marginBottom: '42px',
            },
        },
        addressAndLinking: {
            width: '50%',
            [theme.breakpoints.down(breakpoints.tablet)]: {
                width: '75%',
            },
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        address: {
            width: '70%',
        },
        primary: {
            [theme.breakpoints.up(breakpoints.tablet)]: {
                marginLeft: 64,
            },
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        radio: {
            marginRight: '8px',
        },
        disabledPrimary: {
            color: theme.palette.text.disabled,
        },
    })
})

interface OwnProps {
    onPrimaryChange?: (checked: boolean) => void
    isPrimary: boolean
    primaryDisabled?: boolean
    addressComponent: string | JSX.Element
    linkComponent: string | JSX.Element
}

export type Web3AddressRowProps = OwnProps

const Web3AddressRow = ({
    addressComponent,
    linkComponent,
    isPrimary,
    primaryDisabled = false,
    onPrimaryChange,
}: Web3AddressRowProps) => {
    const classes = useStyles()
    const { t } = useTranslation()

    return (
        <div className={classes.web3Element}>
            <div className={classes.addressAndLinking}>
                <div className={classes.address}>{addressComponent}</div>
                {linkComponent}
            </div>
            <div className={classes.primary}>
                <Radio
                    className={classes.radio}
                    disabled={primaryDisabled}
                    checked={isPrimary}
                    onChange={(event) => onPrimaryChange?.(event.target.checked)}
                />
                <p className={isPrimary ? '' : classes.disabledPrimary}>{t('account.web3.primary')}</p>
            </div>
        </div>
    )
}
export default Web3AddressRow
