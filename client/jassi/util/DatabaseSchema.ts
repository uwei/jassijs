import { db } from "remote/jassi/base/Database";
import { classes } from "remote/jassi/base/Classes";


//define Decoraters for typeorm
let cache={}
function addDecorater(decoratername,...args){

    return function(...fargs){
        var con=fargs.length===1?fargs[0]:fargs[0].constructor;
        var clname=classes.getClassName(con);
        var field=fargs.length==1?"this":fargs[1];
        db._setMetadata(con,field,decoratername,args,fargs);
    }
}

/**
 * Special object that defines order condition for ORDER BY in sql.
 *
 * Example:
 * {
 *  "name": "ASC",
 *  "id": "DESC"
 * }
 */
export declare type OrderByCondition = {
    [columnName: string]: ("ASC" | "DESC") | {
        order: "ASC" | "DESC";
        nulls?: "NULLS FIRST" | "NULLS LAST";
    };
};
/**
 * Describes all entity's options.
 */
export interface EntityOptions {
    /**
     * Table name.
     * If not specified then naming strategy will generate table name from entity name.
     */
    name?: string;
    /**
     * Specifies a default order by used for queries from this table when no explicit order by is specified.
     */
    orderBy?: OrderByCondition | ((object: any) => OrderByCondition | any);
    /**
     * Table's database engine type (like "InnoDB", "MyISAM", etc).
     * It is used only during table creation.
     * If you update this value and table is already created, it will not change table's engine type.
     * Note that not all databases support this option.
     */
    engine?: string;
    /**
     * Database name. Used in Mysql and Sql Server.
     */
    database?: string;
    /**
     * Schema name. Used in Postgres and Sql Server.
     */
    schema?: string;
    /**
     * Indicates if schema synchronization is enabled or disabled for this entity.
     * If it will be set to false then schema sync will and migrations ignore this entity.
     * By default schema synchronization is enabled for all entities.
     */
    synchronize?: boolean;
    /**
     * If set to 'true' this option disables Sqlite's default behaviour of secretly creating
     * an integer primary key column named 'rowid' on table creation.
     * @see https://www.sqlite.org/withoutrowid.html.
     */
    withoutRowid?: boolean;
}

/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function Entity(options?: EntityOptions): Function;
/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function Entity(name?: string, options?: EntityOptions): Function;

export function Entity(...param): Function{
    return addDecorater("Entity",param);
}


/**
 * Column types used for @PrimaryGeneratedColumn() decorator.
 */
export declare type PrimaryGeneratedColumnType = "int" | "int2" | "int4" | "int8" | "integer" | "tinyint" | "smallint" | "mediumint" | "bigint" | "dec" | "decimal" | "fixed" | "numeric" | "number" | "uuid";

/**
 * Describes all options for PrimaryGeneratedColumn decorator with numeric generation strategy.
 */
export interface PrimaryGeneratedColumnNumericOptions {
    /**
     * Column type. Must be one of the value from the ColumnTypes class.
     */
    type?: PrimaryGeneratedColumnType;
    /**
     * Column name in the database.
     */
    name?: string;
    /**
     * Column comment. Not supported by all database types.
     */
    comment?: string;
    /**
     * Puts ZEROFILL attribute on to numeric column. Works only for MySQL.
     * If you specify ZEROFILL for a numeric column, MySQL automatically adds the UNSIGNED attribute to the column
     */
    zerofill?: boolean;
    /**
     * Puts UNSIGNED attribute on to numeric column. Works only for MySQL.
     */
    unsigned?: boolean;
}
/**
 * Describes all options for PrimaryGeneratedColumn decorator with numeric uuid strategy.
 */
export interface PrimaryGeneratedColumnUUIDOptions {
    /**
     * Column name in the database.
     */
    name?: string;
    /**
     * Column comment. Not supported by all database types.
     */
    comment?: string;
}

/**
 * Column decorator is used to mark a specific class property as a table column.
 */
export function PrimaryGeneratedColumn(): Function;
/**
 * Column decorator is used to mark a specific class property as a table column.
 */
export function PrimaryGeneratedColumn(options: PrimaryGeneratedColumnNumericOptions): Function;
/**
 * Column decorator is used to mark a specific class property as a table column.
 */
export function PrimaryGeneratedColumn(strategy: "increment", options?: PrimaryGeneratedColumnNumericOptions): Function;
/**
 * Column decorator is used to mark a specific class property as a table column.
 */
export function PrimaryGeneratedColumn(strategy: "uuid", options?: PrimaryGeneratedColumnUUIDOptions): Function;
/**
 * Column decorator is used to mark a specific class property as a table column.
 */
export function PrimaryGeneratedColumn(strategy: "rowid", options?: PrimaryGeneratedColumnUUIDOptions): Function;
export function PrimaryGeneratedColumn(...param): Function{
    return addDecorater("PrimaryGeneratedColumn",param);
}

export function JoinColumn(...param): Function{
    return addDecorater("JoinColumn",param);
}
export function JoinTable(...param): Function{
    return addDecorater("JoinTable",param);
}
/**
 * Column types where spatial properties are used.
 */
export declare type SpatialColumnType = "geometry" | "geography";
/**
 * Column types where precision and scale properties are used.
 */
export declare type WithPrecisionColumnType = "float" | "double" | "dec" | "decimal" | "fixed" | "numeric" | "real" | "double precision" | "number" | "datetime" | "datetime2" | "datetimeoffset" | "time" | "time with time zone" | "time without time zone" | "timestamp" | "timestamp without time zone" | "timestamp with time zone" | "timestamp with local time zone";
/**
 * Column types where column length is used.
 */
export declare type WithLengthColumnType = "character varying" | "varying character" | "char varying" | "nvarchar" | "national varchar" | "character" | "native character" | "varchar" | "char" | "nchar" | "national char" | "varchar2" | "nvarchar2" | "raw" | "binary" | "varbinary" | "string";
export declare type WithWidthColumnType = "tinyint" | "smallint" | "mediumint" | "int" | "bigint";
/**
 * All other regular column types.
 */
export declare type SimpleColumnType = "simple-array" | "simple-json" | "simple-enum" | "bit" | "int2" | "integer" | "int4" | "int8" | "int64" | "unsigned big int" | "float4" | "float8" | "smallmoney" | "money" | "boolean" | "bool" | "tinyblob" | "tinytext" | "mediumblob" | "mediumtext" | "blob" | "text" | "ntext" | "citext" | "hstore" | "longblob" | "longtext" | "bytes" | "bytea" | "long" | "raw" | "long raw" | "bfile" | "clob" | "nclob" | "image" | "timetz" | "timestamptz" | "timestamp with local time zone" | "smalldatetime" | "date" | "interval year to month" | "interval day to second" | "interval" | "year" | "point" | "line" | "lseg" | "box" | "circle" | "path" | "polygon" | "geography" | "geometry" | "linestring" | "multipoint" | "multilinestring" | "multipolygon" | "geometrycollection" | "int4range" | "int8range" | "numrange" | "tsrange" | "tstzrange" | "daterange" | "enum" | "set" | "cidr" | "inet" | "macaddr" | "bit" | "bit varying" | "varbit" | "tsvector" | "tsquery" | "uuid" | "xml" | "json" | "jsonb" | "varbinary" | "hierarchyid" | "sql_variant" | "rowid" | "urowid" | "uniqueidentifier" | "rowversion" | "array" | "cube";
/**
 * Any column type column can be.
 */
export declare type ColumnType = WithPrecisionColumnType | WithLengthColumnType | WithWidthColumnType | SpatialColumnType | SimpleColumnType | BooleanConstructor | DateConstructor | NumberConstructor | StringConstructor;
/**
 * Interface for objects that deal with (un)marshalling data.
 */
export interface ValueTransformer {
    /**
     * Used to marshal data when writing to the database.
     */
    to(value: any): any;
    /**
     * Used to unmarshal data when reading from the database.
     */
    from(value: any): any;
}
/**
 * Column options specific to all column types.
 */
export interface ColumnCommonOptions {
    /**
     * Indicates if column is always selected by QueryBuilder and find operations.
     * Default value is "true".
     */
    select?: boolean;
    /**
     * Column name in the database.
     */
    name?: string;
    /**
     * Indicates if this column is a primary key.
     * Same can be achieved when @PrimaryColumn decorator is used.
     */
    primary?: boolean;
    /**
     * Specifies if this column will use auto increment (sequence, generated identity, rowid).
     * Note that in some databases only one column in entity can be marked as generated, and it must be a primary column.
     */
    generated?: boolean | "increment" | "uuid" | "rowid";
    /**
     * Specifies if column's value must be unique or not.
     */
    unique?: boolean;
    /**
     * Indicates if column's value can be set to NULL.
     */
    nullable?: boolean;
    /**
     * Default database value.
     * Note that default value is not supported when column type is 'json' of mysql.
     */
    default?: any;
    /**
     * ON UPDATE trigger. Works only for MySQL.
     */
    onUpdate?: string;
    /**
     * Column comment. Not supported by all database types.
     */
    comment?: string;
    /**
     * Indicates if this column is an array.
     * Can be simply set to true or array length can be specified.
     * Supported only by postgres.
     */
    array?: boolean;
    /**
     * Specifies a value transformer that is to be used to (un)marshal
     * this column when reading or writing to the database.
     */
    transformer?: ValueTransformer | ValueTransformer[];
}
/**
 * Describes all column's options.
 */
export interface ColumnOptions extends ColumnCommonOptions {
    /**
     * Column type. Must be one of the value from the ColumnTypes class.
     */
    type?: ColumnType;
    /**
     * Column name in the database.
     */
    name?: string;
    /**
     * Column type's length. Used only on some column types.
     * For example type = "string" and length = "100" means that ORM will create a column with type varchar(100).
     */
    length?: string | number;
    /**
     * Column type's display width. Used only on some column types in MySQL.
     * For example, INT(4) specifies an INT with a display width of four digits.
     */
    width?: number;
    /**
     * Indicates if column's value can be set to NULL.
     */
    nullable?: boolean;
    /**
     * Indicates if column value is not updated by "save" operation.
     * It means you'll be able to write this value only when you first time insert the object.
     * Default value is "false".
     *
     * @deprecated Please use the `update` option instead.  Careful, it takes
     * the opposite value to readonly.
     *
     */
    readonly?: boolean;
    /**
     * Indicates if column value is updated by "save" operation.
     * If false, you'll be able to write this value only when you first time insert the object.
     * Default value is "true".
     */
    update?: boolean;
    /**
     * Indicates if column is always selected by QueryBuilder and find operations.
     * Default value is "true".
     */
    select?: boolean;
    /**
     * Indicates if column is inserted by default.
     * Default value is "true".
     */
    insert?: boolean;
    /**
     * Default database value.
     */
    default?: any;
    /**
     * ON UPDATE trigger. Works only for MySQL.
     */
    onUpdate?: string;
    /**
     * Indicates if this column is a primary key.
     * Same can be achieved when @PrimaryColumn decorator is used.
     */
    primary?: boolean;
    /**
     * Specifies if column's value must be unique or not.
     */
    unique?: boolean;
    /**
     * Column comment. Not supported by all database types.
     */
    comment?: string;
    /**
     * The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum
     * number of digits that are stored for the values.
     */
    precision?: number | null;
    /**
     * The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number
     * of digits to the right of the decimal point and must not be greater than precision.
     */
    scale?: number;
    /**
     * Puts ZEROFILL attribute on to numeric column. Works only for MySQL.
     * If you specify ZEROFILL for a numeric column, MySQL automatically adds the UNSIGNED attribute to this column
     */
    zerofill?: boolean;
    /**
     * Puts UNSIGNED attribute on to numeric column. Works only for MySQL.
     */
    unsigned?: boolean;
    /**
     * Defines a column character set.
     * Not supported by all database types.
     */
    charset?: string;
    /**
     * Defines a column collation.
     */
    collation?: string;
    /**
     * Array of possible enumerated values.
     */
    enum?: (string | number)[] | Object;
    /**
     * Exact name of enum
     */
    enumName?: string;
    /**
     * Generated column expression. Supports only in MySQL.
     */
    asExpression?: string;
    /**
     * Generated column type. Supports only in MySQL.
     */
    generatedType?: "VIRTUAL" | "STORED";
    /**
     * Return type of HSTORE column.
     * Returns value as string or as object.
     */
    hstoreType?: "object" | "string";
    /**
     * Indicates if this column is an array.
     * Can be simply set to true or array length can be specified.
     * Supported only by postgres.
     */
    array?: boolean;
    /**
     * Specifies a value transformer that is to be used to (un)marshal
     * this column when reading or writing to the database.
     */
    transformer?: ValueTransformer | ValueTransformer[];
    /**
     * Spatial Feature Type (Geometry, Point, Polygon, etc.)
     */
    spatialFeatureType?: string;
    /**
     * SRID (Spatial Reference ID (EPSG code))
     */
    srid?: number;
}
/**
 * Column decorator is used to mark a specific class property as a table column. Only properties decorated with this
 * decorator will be persisted to the database when entity be saved.
 */
export function Column(): Function;
/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(options: ColumnOptions): Function;
/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(type: SimpleColumnType, options?: ColumnCommonOptions): Function;

export function Column(...any): Function{
    return addDecorater("Column",any);
}

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 * Primary columns also creates a PRIMARY KEY for this column in a db.
 */
export function PrimaryColumn(options?: ColumnOptions): Function;
/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 * Primary columns also creates a PRIMARY KEY for this column in a db.
 */
export function PrimaryColumn(type?: ColumnType, options?: ColumnOptions): Function;
export function PrimaryColumn(...any): Function{
    return addDecorater("PrimaryColumn",any);
}

/**
 * Represents some Type of the Object.
 */
export declare type ObjectType<T> = {
    new (): T;
} | Function;
/**
 * ON_DELETE type to be used to specify delete strategy when some relation is being deleted from the database.
 */
export declare type OnDeleteType = "RESTRICT" | "CASCADE" | "SET NULL" | "DEFAULT" | "NO ACTION";
/**
 * ON_UPDATE type to be used to specify update strategy when some relation is being updated.
 */
export declare type OnUpdateType = "RESTRICT" | "CASCADE" | "SET NULL" | "DEFAULT" | "NO ACTION";
/**
 * DEFERRABLE type to be used to specify if foreign key constraints can be deferred.
 */
export declare type DeferrableType = "INITIALLY IMMEDIATE" | "INITIALLY DEFERRED";

/**
 * Describes all relation's options.
 */
export interface RelationOptions {
    /**
     * Sets cascades options for the given relation.
     * If set to true then it means that related object can be allowed to be inserted or updated in the database.
     * You can separately restrict cascades to insertion or updation using following syntax:
     *
     * cascade: ["insert", "update"] // include or exclude one of them
     */
    cascade?: boolean | ("insert" | "update" | "remove")[];
    /**
     * Indicates if relation column value can be nullable or not.
     */
    nullable?: boolean;
    /**
     * Database cascade action on delete.
     */
    onDelete?: OnDeleteType;
    /**
     * Database cascade action on update.
     */
    onUpdate?: OnUpdateType;
    /**
     * Indicate if foreign key constraints can be deferred.
     */
    deferrable?: DeferrableType;
    /**
     * Indicates if this relation will be a primary key.
     * Can be used only for many-to-one and owner one-to-one relations.
     */
    primary?: boolean;
    /**
     * Set this relation to be lazy. Note: lazy relations are promises. When you call them they return promise
     * which resolve relation result then. If your property's type is Promise then this relation is set to lazy automatically.
     */
    lazy?: boolean;
    /**
     * Set this relation to be eager.
     * Eager relations are always loaded automatically when relation's owner entity is loaded using find* methods.
     * Only using QueryBuilder prevents loading eager relations.
     * Eager flag cannot be set from both sides of relation - you can eager load only one side of the relationship.
     */
    eager?: boolean;
    /**
     * Indicates if persistence is enabled for the relation.
     * By default its enabled, but if you want to avoid any changes in the relation to be reflected in the database you can disable it.
     * If its disabled you can only change a relation from inverse side of a relation or using relation query builder functionality.
     * This is useful for performance optimization since its disabling avoid multiple extra queries during entity save.
     */
    persistence?: boolean;
}

/**
 * One-to-one relation allows to create direct relation between two entities. Entity1 have only one Entity2.
 * Entity1 is an owner of the relationship, and storages Entity1 id on its own side.
 */
export function OneToOne<T>(typeFunctionOrTarget: string | ((type?: any) => ObjectType<T>), options?: RelationOptions): Function;
/**
 * One-to-one relation allows to create direct relation between two entities. Entity1 have only one Entity2.
 * Entity1 is an owner of the relationship, and storages Entity1 id on its own side.
 */
export function OneToOne<T>(typeFunctionOrTarget: string | ((type?: any) => ObjectType<T>), inverseSide?: string | ((object: T) => any), options?: RelationOptions): Function;
export function OneToOne(...any): Function{
    return addDecorater("OneToOne",any);
}

/**
 * One-to-many relation allows to create type of relation when Entity2 can have multiple instances of Entity1.
 * Entity1 have only one Entity2. Entity1 is an owner of the relationship, and storages Entity2 id on its own side.
 */
export function OneToMany<T>(typeFunctionOrTarget: string | ((type?: any) => ObjectType<T>), inverseSide: string | ((object: T) => any), options?: RelationOptions): Function;
export function OneToMany(...any): Function{
    return addDecorater("OneToMany",any);
}

/**
 * Many-to-one relation allows to create type of relation when Entity1 can have single instance of Entity2, but
 * Entity2 can have a multiple instances of Entity1. Entity1 is an owner of the relationship, and storages Entity2 id
 * on its own side.
 */
export function ManyToOne<T>(typeFunctionOrTarget: string | ((type?: any) => ObjectType<T>), options?: RelationOptions): Function;
/**
 * Many-to-one relation allows to create type of relation when Entity1 can have single instance of Entity2, but
 * Entity2 can have a multiple instances of Entity1. Entity1 is an owner of the relationship, and storages Entity2 id
 * on its own side.
 */
export  function ManyToOne<T>(typeFunctionOrTarget: string | ((type?: any) => ObjectType<T>), inverseSide?: string | ((object: T) => any), options?: RelationOptions): Function;
export function ManyToOne(...any): Function{
    return addDecorater("ManyToOne",any);
}

/**
 * Many-to-many is a type of relationship when Entity1 can have multiple instances of Entity2, and Entity2 can have
 * multiple instances of Entity1. To achieve it, this type of relation creates a junction table, where it storage
 * entity1 and entity2 ids. This is owner side of the relationship.
 */
export  function ManyToMany<T>(typeFunctionOrTarget: string | ((type?: any) => ObjectType<T>), options?: RelationOptions): Function;
/**
 * Many-to-many is a type of relationship when Entity1 can have multiple instances of Entity2, and Entity2 can have
 * multiple instances of Entity1. To achieve it, this type of relation creates a junction table, where it storage
 * entity1 and entity2 ids. This is owner side of the relationship.
 */
export function ManyToMany<T>(typeFunctionOrTarget: string | ((type?: any) => ObjectType<T>), inverseSide?: string | ((object: T) => any), options?: RelationOptions): Function;
export function ManyToMany(...any): Function{
    return addDecorater("ManyToMany",any);
}