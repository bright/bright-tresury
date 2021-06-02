# 10. How do we write React components

Date: 2021-03-10

## Status

Accepted

## Context

React is not opinionated, so each team has to find their own ways to keep the code consistent. 
 
## Decision

We do not explicitly type the component, only the props in the component definition. Example: `const Button = ({color, children}: ButtonProps) => {`
We name the props interface after the component name and add `Props` suffix. We always export the props interface. Example: `export interface ButtonProps {`
We can use `PropsWithChildren` to add special `children` prop and compose the result props type. We add it only if we really accept `children` on our component. Example: `export type ButtonProps = PropsWithChildren<OwnProps>`
We always destructure props.
We export the component using the default export.

The whole example component:

```
interface OwnProps {
    color: string
}

export type ButtonProps = PropsWithChildren<OwnProps>

const Button = ({color, children}: ButtonProps) => {
    return (
        <MaterialButton color={color} variant='text'>
            {children}
        </MaterialButton>
    )
}

export default Button
```

## Consequences

The component definitions are consistent.
We still may have some pieces of code not following the decision. Please use the boy-scout rule and apply the decision to any file you touch.
