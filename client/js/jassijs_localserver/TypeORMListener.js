var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Registry", "typeorm", "jassijs_localserver/Filesystem", "jassijs/util/Reloader", "jassijs/remote/Registry", "jassijs/remote/Serverservice"], function (require, exports, Registry_1, typeorm_1, Filesystem_1, Reloader_1, Registry_2, Serverservice_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypeORMListener = void 0;
    //listener for code changes
    Reloader_1.Reloader.instance.addEventCodeReloaded(async function (files) {
        var dbobjects = await Registry_2.default.getJSONData("$DBObject");
        var reload = false;
        for (var x = 0; x < files.length; x++) {
            var file = files[x];
            dbobjects.forEach((data) => {
                if (data.filename === file + ".ts")
                    reload = true;
            });
        }
        if (reload) {
            (await Serverservice_1.serverservices.db).renewConnection();
        }
    });
    let TypeORMListener = class TypeORMListener {
        saveDB(event) {
            if (this.savetimer) {
                clearTimeout(this.savetimer);
                this.savetimer = undefined;
            }
            this.savetimer = setTimeout(() => {
                var data = event.connection.driver.export();
                new Filesystem_1.default().saveFile("__default.db", data);
                console.log("save DB");
            }, 300);
        }
        /**
         * Called after entity is loaded.
         */
        afterLoad(entity) {
            // console.log(`AFTER ENTITY LOADED: `, entity);
        }
        /**
         * Called before post insertion.
         */
        beforeInsert(event) {
            //console.log(`BEFORE POST INSERTED: `, event.entity);
        }
        /**
         * Called after entity insertion.
         */
        afterInsert(event) {
            this.saveDB(event);
            //console.log(`AFTER ENTITY INSERTED: `, event.entity);
        }
        /**
         * Called before entity update.
         */
        beforeUpdate(event) {
            //console.log(`BEFORE ENTITY UPDATED: `, event.entity);
        }
        /**
         * Called after entity update.
         */
        afterUpdate(event) {
            this.saveDB(event);
            //console.log(`AFTER ENTITY UPDATED: `, event.entity);
        }
        /**
         * Called before entity removal.
         */
        beforeRemove(event) {
            // console.log(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
        }
        /**
         * Called after entity removal.
         */
        afterRemove(event) {
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
        afterTransactionStart(event /*: TransactionStartEvent*/) {
            //console.log(`AFTER TRANSACTION STARTED: `, event);
        }
        /**
         * Called before transaction commit.
         */
        beforeTransactionCommit(event /*: TransactionCommitEvent*/) {
            // console.log(`BEFORE TRANSACTION COMMITTED: `, event);
        }
        /**
         * Called after transaction commit.
         */
        afterTransactionCommit(event /*: TransactionCommitEvent*/) {
            //console.log(`AFTER TRANSACTION COMMITTED: `, event);
        }
        /**
         * Called before transaction rollback.
         */
        beforeTransactionRollback(event /*: TransactionRollbackEvent*/) {
            //   console.log(`BEFORE TRANSACTION ROLLBACK: `, event);
        }
        /**
         * Called after transaction rollback.
         */
        afterTransactionRollback(event /*: TransactionRollbackEvent*/) {
            // console.log(`AFTER TRANSACTION ROLLBACK: `, event);
        }
    };
    TypeORMListener = __decorate([
        (0, typeorm_1.EventSubscriber)(),
        (0, Registry_1.$Class)("jassijs_localserver.TypeORMListener")
    ], TypeORMListener);
    exports.TypeORMListener = TypeORMListener;
});
//# sourceMappingURL=TypeORMListener.js.map