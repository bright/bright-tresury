import {Time} from "@polkadot/util/types";
import {TFunction} from "i18next";

export function ellipseTextInTheMiddle(value: string, visibleCharacters: number = 12): string {
    if (value.length > visibleCharacters && visibleCharacters > 0) {
        const prefix = value.substring(0, visibleCharacters / 2)
        const suffix = value.substring(value.length - (visibleCharacters / 2))
        return `${prefix}...${suffix}`
    } else {
        return value
    }
}
export function singularPluralOrNull(count: number, singular: string, plural: string): string | null {
    return count ? Math.abs(count) > 1 ? `${count}${plural}` : `${count}${singular}` : null;
}
export function remainingTimeToStr({ days, hours, minutes, seconds }: Time, t: TFunction): string {
    return [
        singularPluralOrNull(days, t('common.dateTime.day'), t('common.dateTime.days')),
        singularPluralOrNull(hours, t('common.dateTime.hour'), t('common.dateTime.hours')),
        singularPluralOrNull(minutes, t('common.dateTime.minute'), t('common.dateTime.minutes')),
        singularPluralOrNull(seconds, t('common.dateTime.second'), t('common.dateTime.seconds'))
    ]
        .filter((value): value is string => !!value)
        .slice(0, 2)
        .join(' ');
}
