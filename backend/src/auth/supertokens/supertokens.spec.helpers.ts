import {memoize} from "lodash";
import {Connection, getConnection} from "typeorm";
import {AuthorizationDatabaseName} from "../../database/database.module";
import {User} from "supertokens-node/lib/build/recipe/emailpassword/types";

const getAuthConnection = memoize(
    async (): Promise<Connection> => {
        return getConnection(AuthorizationDatabaseName);
    })

const authorizationTablesToRemove = memoize(
    async (): Promise<Array<{ table_name: string }>> => {
        const connection = await getAuthConnection()
        return await connection.query(`
            select * from information_schema.tables where 
            table_schema='public'
        `)
    }
)

export const getAuthUser = async (userId: string): Promise<User | undefined> => {
    const connection = await getAuthConnection()
    const plainUser = await connection.query(`
        SELECT * FROM emailpassword_users WHERE user_id = '${userId}'
    `)
    return plainUser.length > 0 ? {
        id: plainUser[0].user_id,
        email: plainUser[0].email,
        timeJoined: plainUser[0].time_joined,
    } as User : undefined
}

export const cleanAuthorizationDatabase = async () => {
    try {
        const tables = await authorizationTablesToRemove()
        const connection = await getAuthConnection()
        const tableList = tables.map((t: any) => `"${t.table_name}"`).join(', ')
        if (tableList) {
            const truncateQuery = `truncate ${tableList};`
            return await connection.query(truncateQuery)
        } else {
            // tslint:disable-next-line:no-console
            console.error(`Table list empty`)
        }
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.error('Please make sure that beforeSetupFullApp is called before cleanDatabase.')
        // tslint:disable-next-line:no-console
        console.error(e)
    }
}
