import * as mongoose from 'mongoose';
import * as _ from 'lodash';

export default abstract class {
    private db;
    private schema;
    constructor(DB){
        this.schema = this.buildSchema();
        this.db = DB.model(this.getName(), this.schema);
    }

    private buildSchema(){
        const schema = new mongoose.Schema(_.extend({
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date
            }
        }, this.getSchema()));

        schema.pre('save', function(next){
            if(!this['updatedAt']){
                this['updatedAt'] = Date.now();
                next();
            }
        });

        return schema;
    }

    protected abstract getSchema(): mongoose.SchemaDefinition;
    protected abstract getName(): string;

    public async save(doc: object){
        return await this.db.create(doc);
    }
    public async find(query){
        return await this.db.find(query);
    }
}