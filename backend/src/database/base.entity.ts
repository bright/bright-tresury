import { BeforeInsert, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

export class BaseEntity {
    @PrimaryColumn() id: string = uuid()

    @CreateDateColumn({
        type: 'timestamp',
    })
    createdAt: Date = new Date()

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updatedAt',
    })
    updatedAt: Date = this.createdAt

    @BeforeInsert()
    generateUuid() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}
