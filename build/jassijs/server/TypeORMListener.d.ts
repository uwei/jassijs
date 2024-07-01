import { EntitySubscriberInterface, InsertEvent, RemoveEvent, UpdateEvent } from "typeorm";
export declare class TypeORMListener implements EntitySubscriberInterface {
    savetimer: any;
    saveDB(event: any): void;
    /**
     * Called after entity is loaded.
     */
    afterLoad(entity: any): void;
    /**
     * Called before post insertion.
     */
    beforeInsert(event: InsertEvent<any>): void;
    /**
     * Called after entity insertion.
     */
    afterInsert(event: InsertEvent<any>): void;
    /**
     * Called before entity update.
     */
    beforeUpdate(event: UpdateEvent<any>): void;
    /**
     * Called after entity update.
     */
    afterUpdate(event: UpdateEvent<any>): void;
    /**
     * Called before entity removal.
     */
    beforeRemove(event: RemoveEvent<any>): void;
    /**
     * Called after entity removal.
     */
    afterRemove(event: RemoveEvent<any>): void;
    /**
     * Called before transaction start.
     */
    beforeTransactionStart(event: any): void;
    /**
     * Called after transaction start.
     */
    afterTransactionStart(event: any): void;
    /**
     * Called before transaction commit.
     */
    beforeTransactionCommit(event: any): void;
    /**
     * Called after transaction commit.
     */
    afterTransactionCommit(event: any): void;
    /**
     * Called before transaction rollback.
     */
    beforeTransactionRollback(event: any): void;
    /**
     * Called after transaction rollback.
     */
    afterTransactionRollback(event: any): void;
}
