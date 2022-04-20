import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { isValidAddress } from '../../../../util/addressValidator'
import User from '../../../user/User'
import TextField, { TextFieldProps } from '../TextField'

const useStyles = makeStyles(() =>
    createStyles({
        userContainer: {
            backgroundColor: 'white',
        },
        hidden: {
            display: 'none',
        },
    }),
)

interface OwnProps {}

export type Web3AddressInputProps = OwnProps & TextFieldProps

const Web3AddressInput = ({ ...props }: Web3AddressInputProps) => {
    const classes = useStyles()
    const [inputFocused, setInputFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const showInput = useMemo(
        () => inputFocused || !props.inputProps || props.inputProps.error || !isValidAddress(props.inputProps.value),
        [inputFocused, props.inputProps],
    )

    const focusInput = () => setInputFocused(true)

    const blurInput = () => setInputFocused(false)

    useEffect(() => {
        if (showInput && inputRef && inputFocused) {
            inputRef.current?.focus()
        }
    }, [showInput, inputRef, inputFocused])

    return (
        <>
            <TextField className={showInput ? '' : classes.hidden} {...props} inputRef={inputRef} onBlur={blurInput} />
            {!showInput ? (
                <div className={classes.userContainer} onClick={focusInput}>
                    <User
                        user={{
                            web3address: props.inputProps?.value,
                        }}
                        ellipsis={false}
                    />
                </div>
            ) : null}
        </>
    )
}

export default Web3AddressInput
