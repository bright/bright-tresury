# 2. Defining Dto

Date: 2021-01-23

## Status

Accepted

## Context

Api controllers does not filter body, response or query params by default. If we specify body type to
some particular DTO class, then it is still allowed to send any json properties by the client, even
those that are not specified in the DTO class. It may be dangerous if we won't filter client's
request to match our models. Consider simple patch method in the service:

```
function updateModel(patch: Partial<ModelDto>, id: string) {
    const currentModel: ModelEntity = repository.getModel(id)
    const patchedModel = {
        ...currentModel,
        ...patch
    } as ModelEntity
    repository.save(patchedModel)
}
```

If our ModelEntity has some specific property that shouldn't be edited manually (e.g. auto incremented
properties) then it allows the client to force edit it. Of course if our database will be configured properly
it would result in throwing an exception, but then it would be advisable to catch database exceptions and map
them into proper http exceptions.

It is much easier to filter out the request body coming from the client. If we don't want to receive any
properties that are not specified in our DTO class, then let's filter them out.

## Decision

We will use the following validation option: `whitelist: true` for the global ValidationPipe.

## Consequences

In order to receive a particular DTO property from the client we need to add any validation decorator from
`class-validator` library on this property.

Example:

```
interface CreatePersonDto {
    @IsNotEmpty()
    firstName: string
}
```

If some particular property does not need to be validated, but we still want to receive it from the client,
we could use `@Allow` decorator, but please try to avoid that and use `@IsOptional` or `@IsNotEmpty` instead.

Example:

```
interface CreatePersonDto {
    @Allow
    lastName: string
}
```

We don't need to add any validators to dto models which represents return objects.
