import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const PackageSchema = new mongoose.Schema({
    trackerNumber: {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    urlImage: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createAt: {
        type: Date,
        default: Date.now
    }

});

PackageSchema.plugin(mongoosePaginate);

export default mongoose.model('Package', PackageSchema);