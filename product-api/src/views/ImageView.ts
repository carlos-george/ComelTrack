import dotenv from 'dotenv';
dotenv.config();

import Image from '../entities/Image';

export default {
    render(image: Image) {
        return {
            id: image.id,
            path: `${process.env.APP_URL}${image.imageKey}`
        };
    },
    renderMany(images: Image[]) {
        return images.map(image => this.render(image));
    }
}