import { Request, Response } from 'express';
import aws from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const s3 = new aws.S3();

import db from '../config/database/connection_knex';

enum Status {
    RECEIVED = 'received',
    REGISTERED = 'registered',
    DELIVERED = 'delivered'
}

class PackageController {

    async index(request: Request, response: Response) {

        const { page = 1, destinationName, trackerNumber } = request.query;
        const { data, pagination } = await db('packages')
            .where(function () {
                if (trackerNumber) {
                    this.where('packages.trackerNumber', trackerNumber as string)
                }
            })
            .where(function () {
                if (destinationName) {
                    this.where('packages.destinationName', 'LIKE', `%${destinationName}%`)
                }
            })
            .where('packages.status', Status.RECEIVED)
            .select('*').paginate({ perPage: 10, currentPage: Number(page), isLengthAware: true });

        if (pagination.total === 0) return response.status(400).json({ message: 'Mercadoria não encontrada.' })

        return response.json({ data, pagination });
    }

    async show(request: Request, response: Response) {

        const { id } = request.params;

        const packs = await db('packages').where('packages.id', id);
        const pack = packs[0];

        if (!pack) return response.status(400).json({ message: 'Encomenda não encontrada na base de dados.' });

        return response.json(pack);
    }

    async create(request: Request, response: Response) {

        const { trackerNumber,
            destinationName,
            observation
        } = request.body;

        console.log('TrackerNumber: ', trackerNumber);

        const { filename: imageKey } = request.file;

        let urlImage = '';

        if (process.env.STORAGE_TYPE === 's3') {

            urlImage = `${process.env.APP_URL}/${imageKey}`;
        } else {
            urlImage = `${process.env.APP_URL}/uploads/${imageKey}`;
        }

        const trx = await db.transaction();

        try {

            const packsReceiveds = await trx('packages')
                .where('packages.trackerNumber', trackerNumber)
                .where('packages.status', Status.RECEIVED)
                .select('packages.id');

            if (packsReceiveds.length !== 0) {
                return response.status(400)
                    .json({
                        message: 'Existe uma mercadoria com esse ' +
                            'rastreador cadastrado na base de dados.'
                    });
            }

            const packsRgistereds = await trx('packages')
                .where('packages.trackerNumber', trackerNumber)
                .where('packages.status', Status.REGISTERED)
                .select('packages.id');

            const status = Status.RECEIVED;

            if (packsRgistereds.length !== 0) {

                const { id } = packsRgistereds[0];

                await trx('packages')
                    .where('packages.id', id)
                    .update({
                        destinationName,
                        observation,
                        status,
                        imageKey,
                        urlImage,
                    });
            } else {

                await trx('packages').insert({
                    trackerNumber,
                    destinationName,
                    observation,
                    status,
                    imageKey,
                    urlImage,
                });
            }

            trx.commit();

            return response.json({ message: 'Encomenda cadastrada com sucesso.' });

        } catch (error) {
            console.log(error);
            await trx.rollback();

            return response.status(400).json({
                error: 'Erro inesperado ao cadatrar nova encomenda.'
            });
        }

    }

    async dwellerCreate(request: Request, response: Response) {

        const { trackerNumber,
            description
        } = request.body;

        const trx = await db.transaction();

        try {

            const packsRgistereds = await trx('packages')
                .where('packages.trackerNumber', trackerNumber)
                .where('packages.status', Status.REGISTERED)
                .select('packages.id');

            if (packsRgistereds.length !== 0) {
                return response.status(500)
                    .json({
                        message: 'Existe uma mercadoria com esse ' +
                            'rastreador cadastrado na base de dados.'
                    });
            }

            const packsReceiveds = await trx('packages')
                .where('packages.trackerNumber', trackerNumber)
                .where('packages.status', Status.RECEIVED)
                .select('packages.id');

            if (packsReceiveds.length !== 0) {

                const { id } = packsReceiveds[0];

                await trx('packages')
                    .where('packages.id', id)
                    .update({
                        description,
                    });

                trx.commit();

                return response.json({ message: 'Sua encomenda encontra-se disponível para retirada.' });
            } else {
                const status = Status.REGISTERED;

                await trx('packages').insert({
                    trackerNumber,
                    description,
                    status,
                });
            }

            trx.commit();

            return response.json({ message: 'Encomenda cadastrada com sucesso.' });

        } catch (error) {
            console.log(error);
            await trx.rollback();

            return response.status(400).json({
                error: 'Erro inesperado ao cadatrar nova encomenda.'
            });
        }

    }

    async delivery(request: Request, response: Response) {

        const { docNumber, numProtocol } = request.body;
        const { id } = request.params;

        const trx = await db.transaction();

        try {

            await trx('packages')
                .where('packages.id', '=', id)
                .update({
                    docNumber,
                    numProtocol,
                    status: Status.DELIVERED
                });
            return response.json({ message: 'Encomenda entregue ao destinatário com sucesso.' });

        } catch (error) {
            console.log(error);
            await trx.rollback();

            return response.status(400).json({
                error: 'Erro inesperado ao realizar entrega de encomenda.'
            });
        }

    }

    async delete(request: Request, response: Response) {

        const { id } = request.params;

        const trx = await db.transaction();

        try {

            const packs = await trx('packages').where('packages.id', id);
            const pack = packs[0];

            if (!pack) return response.status(400).json({ message: 'Encomenda não encontrada na base de dados.' });

            const { imageKey } = pack;

            await trx('packages')
                .where('packages.id', id)
                .del();

            if (imageKey) {

                if (process.env.STORAGE_TYPE === 's3') {
                    s3.deleteObject({
                        Bucket: process.env.AWS_BUCKET!,
                        Key: imageKey
                    }).promise();
                } else {
                    promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'uploads', imageKey));
                }
            }

            trx.commit();

            return response.send();

        } catch (error) {
            console.log(error);
            await trx.rollback();

            return response.status(400).json({
                error: 'Erro inesperado ao realizar exclusão da encomenda.'
            });
        }

    }
}

export default PackageController;