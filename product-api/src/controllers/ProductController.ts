import { Request, Response } from 'express';
import { getRepository, IsNull, Like, Raw } from 'typeorm';

import Product from '../entities/Product';
import ProductView from '../views/ProductView';

enum Status {
    RECEIVED = 'received',
    REGISTERED = 'registered',
    DELIVERED = 'delivered'
}

export default {
    async index(request: Request, response: Response) {

        const { page = 1, destinationName, trackerNumber } = request.query;

        const productRepo = getRepository(Product);

        const totalPerPage = 10;

        const skippedItems = (+page - 1) * totalPerPage;

        const totalCount = await productRepo.count();

        const products = await productRepo.find({
            skip: skippedItems,
            take: totalPerPage,
            relations: ['user', 'images'],
            where: {
                trackerNumber: Raw(alias => {

                    if (trackerNumber) return `${alias} = '${trackerNumber}'`;

                    return '';
                }),
                destinationName: Raw(alias => {

                    if (destinationName) return `${alias} LIKE '%${destinationName}%'`;

                    return '';
                })
            }

        });

        let isLastPage = false;

        if (products.length < totalPerPage) isLastPage = true;

        return response.status(200).json({
            data: ProductView.renderMany(products),
            totalCount,
            totalPerPage,
            currentPage: +page,
            isLastPage,
        });
    },

    async create(request: Request, response: Response) {

        const productRepo = getRepository(Product);

        const { trackerNumber,
            destinationName,
            description
        } = request.body;

        const requestImages = request.files as Express.Multer.File[];

        const images = requestImages.map(image => {
            return { imageKey: image.filename }
        });

        const productReceiveds = await productRepo.find({
            where: {
                trackerNumber,
                status: Status.RECEIVED
            }
        });

        if (productReceiveds.length !== 0) {
            return response.status(400)
                .json({
                    message: 'Existe uma mercadoria com esse ' +
                        'rastreador cadastrado na base de dados.'
                });
        }

        const productRgistereds = await productRepo.find({
            where: {
                trackerNumber,
                status: Status.REGISTERED
            }
        });

        const status = Status.RECEIVED;

        if (productRgistereds.length !== 0) {

            const { id } = productRgistereds[0];
            console.log('Identificador: ', id);

            await productRepo.save({
                id,
                destinationName,
                description,
                status,
                images
            });

        } else {

            const product = await productRepo.create({
                trackerNumber,
                destinationName,
                description,
                status,
                images
            });

            await productRepo.save(product);
        }

        return response.status(201).json({ message: 'Encomenda cadastrada com sucesso.' });


    }
}