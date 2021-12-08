import React, { useState } from 'react'
import Select from './Select'
import { useTranslation } from 'react-i18next'

interface OwnProps {
    onTimeFrameChange: (newTimeFrame: TimeFrame) => any
}

export type TimeSelectProps = OwnProps

export enum TimeFrame {
    OnChain = 'OnChain',
    History = 'History',
}

const TimeSelect = ({onTimeFrameChange}: TimeSelectProps) => {
    const { t } = useTranslation()
    const [value, setValue] = useState(TimeFrame.OnChain)

    const options: { [key in TimeFrame]: string } = {
        [TimeFrame.OnChain]: 'components.timeSelect.onChain',
        [TimeFrame.History]: 'components.timeSelect.history',
    }

    return (
        <Select
            value={value}
            options={Object.keys(options)}
            renderOption={(option: TimeFrame) => t(options[option])}
            onChange={({ target }) => {
                const newTimeFrame: TimeFrame = target.value as TimeFrame
                onTimeFrameChange(newTimeFrame)
                setValue(newTimeFrame)
            }}
        />
    )
}
export default TimeSelect
