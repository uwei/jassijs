import { $Class } from "jassijs/remote/Registry";
//@ts-ignore
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from "typeorm";
import Filesystem from "jassijs/server/Filesystem";
import { Reloader } from "jassijs/util/Reloader";
import registry from "jassijs/remote/Registry";
import { serverservices } from "jassijs/remote/Serverservice";


//listener for code changes
Reloader.instance.addEventCodeReloaded(async function (files: string[]) {
    var dbobjects = await registry.getJSONData("$DBObject");
    var reload = false;
    for (var x = 0; x < files.length; x++) {
        var file = files[x];
        dbobjects.forEach((data) => {
            if (data.filename === file+".ts")
                reload = true;
        });
    }
    if(reload){
        (await serverservices.db).renewConnection();
    }
});

@EventSubscriber()
@$Class("jassijs.server.TypeORMListener")
export class TypeORMListener implements EntitySubscriberInterface {
    savetimer;
    saveDB(event) {
        if (this.savetimer) {
            clearTimeout(this.savetimer);
            this.savetimer = undefined;
        }
        this.savetimer = setTimeout(() => {
            var data = event.connection.driver.export();
            new Filesystem().saveFile("__default.db", data);
            console.log("save DB");
        }, 300);

    }
    /**
     * Called after entity is loaded.
     */
    afterLoad(entity: any) {
        // console.log(`AFTER ENTITY LOADED: `, entity);
    }

    /**
     * Called before post insertion.
     */
    beforeInsert(event: InsertEvent<any>) {
        //console.log(`BEFORE POST INSERTED: `, event.entity);
    }

    /**
     * Called after entity insertion.
     */
    afterInsert(event: InsertEvent<any>) {
        this.saveDB(event);
        //console.log(`AFTER ENTITY INSERTED: `, event.entity);
    }

    /**
     * Called before entity update.
     */
    beforeUpdate(event: UpdateEvent<any>) {
        //console.log(`BEFORE ENTITY UPDATED: `, event.entity);
    }

    /**
     * Called after entity update.
     */
    afterUpdate(event: UpdateEvent<any>) {
        this.saveDB(event);
        //console.log(`AFTER ENTITY UPDATED: `, event.entity);
    }

    /**
     * Called before entity removal.
     */
    beforeRemove(event: RemoveEvent<any>) {
        // console.log(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
    }

    /**
     * Called after entity removal.
     */
    afterRemove(event: RemoveEvent<any>) {
        //  console.log(`AFTER ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
        this.saveDB(event);
    }

    /**
     * Called before transaction start.
     */
    beforeTransactionStart(event) {
        // console.log(`BEFORE TRANSACTION STARTED: `, event);
    }

    /**
     * Called after transaction start.
     */
    afterTransactionStart(event/*: TransactionStartEvent*/) {
        //console.log(`AFTER TRANSACTION STARTED: `, event);
    }

    /**
     * Called before transaction commit.
     */
    beforeTransactionCommit(event/*: TransactionCommitEvent*/) {
        // console.log(`BEFORE TRANSACTION COMMITTED: `, event);
    }

    /**
     * Called after transaction commit.
     */
    afterTransactionCommit(event/*: TransactionCommitEvent*/) {
        //console.log(`AFTER TRANSACTION COMMITTED: `, event);
    }

    /**
     * Called before transaction rollback.
     */
    beforeTransactionRollback(event/*: TransactionRollbackEvent*/) {
        //   console.log(`BEFORE TRANSACTION ROLLBACK: `, event);
    }

    /**
     * Called after transaction rollback.
     */
    afterTransactionRollback(event/*: TransactionRollbackEvent*/) {
        // console.log(`AFTER TRANSACTION ROLLBACK: `, event);
    }

}