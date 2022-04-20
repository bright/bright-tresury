export interface ClassNameProps {
    className?: string
}

export interface ClassesProps<ClassKey extends string = string> {
    classes?: Partial<ClassNameMap<ClassKey>>
}

export type ClassNameMap<ClassKey extends string = string> = Record<ClassKey, string>
