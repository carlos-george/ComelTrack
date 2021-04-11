import Product from '../entities/Product';
import ImageView from './ImageView';

export default {
    render(product: Product) {
        return {
            id: product.id,
            trackerNumber: product.trackerNumber,
            destinationName: product.destinationName,
            description: product.description,
            observation: product.observation,
            images: ImageView.renderMany(product.images)
        };
    },
    renderMany(products: Product[]) {
        return products.map(product => this.render(product));
    }
}