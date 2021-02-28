var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassi/remote/Jassi", "typeorm"], function (require, exports, Jassi_1, typeorm_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypeORMListener = void 0;
    let TypeORMListener = class TypeORMListener {
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
            // console.log(`AFTER ENTITY UPDATED: `, event.entity);
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
            console.log(`AFTER ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
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
        typeorm_1.EventSubscriber(),
        Jassi_1.$Class("jassi_localserver/TypeORMListener")
    ], TypeORMListener);
    exports.TypeORMListener = TypeORMListener;
});
//# sourceMappingURL=TypeORMListener.js.map