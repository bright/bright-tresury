import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { useMemo } from 'react'
import { Mention, MentionsInput, MentionsInputProps, SuggestionDataItem } from 'react-mentions'
import { AuthorDto } from '../../../../util/author.dto'
import SuggestionItem from './SuggesionItem'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        control: {
            height: '4em',
            fontFamily: theme.typography.fontFamily,
            fontSize: '14px',
            fontWeight: 500,
            outline: 'none',
            border: '1px solid',
            borderColor: theme.palette.background.paper,
            borderRadius: '3px',
            '& strong': {
                backgroundColor: theme.palette.secondary.main,
                borderRadius: '3px',
            },
            '& textarea': {
                backgroundColor: 'green',
                border: 'none',
                resize: 'none',
                '&:focus-visible': {
                    outline: 'none',
                    border: '1px solid',
                    borderColor: theme.palette.primary.main,
                    borderRadius: '3px',
                },
            },
        },
        control__suggestions__list: {
            borderRadius: '8px',
            padding: '0px 0px !important',
            '::last-of-type': {
                backgroundColor: 'red',
            },
            boxShadow: '0px 0px 60px #00000029',
        },
        'control__suggestions__item--focused': {
            backgroundColor: '#0025600B',
        },
    }),
)

interface OwnProps {
    people: AuthorDto[]
}

export type CommentInputProps = OwnProps & Omit<MentionsInputProps, 'children'>

export type EnhancedSuggestionDataItem = SuggestionDataItem & { author: AuthorDto }

const CommentInput = ({ people = [], ...props }: CommentInputProps) => {
    const classes = useStyles()

    const data: EnhancedSuggestionDataItem[] = useMemo(
        () =>
            people?.map((person) => ({
                id: person.userId,
                display: person.username ?? person.web3address ?? person.userId,
                author: person,
            })),
        [people],
    )

    // TODO enable manually inserting the tag TREAS-459

    return (
        <MentionsInput {...props} classNames={classes}>
            <Mention
                trigger="@"
                data={data}
                markup={'[@__display__](__id__)'}
                renderSuggestion={(suggestion) => (
                    <SuggestionItem author={(suggestion as EnhancedSuggestionDataItem).author} />
                )}
                displayTransform={(id, display) => `@${display}`}
                appendSpaceOnAdd={true}
            />
        </MentionsInput>
    )
}
export default CommentInput
