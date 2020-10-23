import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import aws from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const s3 = new aws.S3();

const ProductSchema = new mongoose.Schema({
        trackerNumber: {
            type: String,
            required: true,
            unique: true
        },
        destinationName: {
            type: String,
            required: true
        },
        title: {
           type: String,
           required: true
        },
        description: {
            type: String,
            required: true
        },
        urlImage: {
            type: String
        },
        imageKey: {
            type: String
        },
        status: {
            type: String,
            required: true
        },
        docNumber: {
            type: String
        },
        updateAt: {
            type: Date
        },
        createAt: {
            type: Date,
            default: Date.now
        }
    });

ProductSchema.plugin(mongoosePaginate);

ProductSchema.pre('save', function() {
    if(!this.urlImage) {
        this.urlImage = `${process.env.APP_URL}/uploads/${this.imageKey}`;
    }
});

ProductSchema.pre('remove', function() {
    if( process.env.STORAGE_TYPE === 's3') {
        return s3.deleteObject({
            Bucket: process.env.AWS_BUCKET!,
            Key: this.imageKey
        }).promise();
    } else {
        return promisify(fs.unlink)(path.resolve(__dirname, '..','..', 'uploads', this.imageKey));
    }
});

export default mongoose.model('Product', ProductSchema);