import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { FiDownload, FiCheck, FiChevronLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import crypto from 'crypto';
import api from '../../services/api';


import './styles.css';
import PageDefault from '../../components/PageDefault';

interface Product {
    id: string;
    trackerNumber: string;
    destinationName: string;
    status: string;
    description: string;
    imageKey: string;
    urlImage: string;
    createAt: Date;
}

const Product = () => {

    const { id } = useParams();

    const history = useHistory();

    const [product, setProduct] = useState<Product>({} as Product);
    const [formData, setFormData] = useState({
        docNumber: '',
        nameReceived: ''
    });
    const [protocol, setProtocol] = useState<string>('');
    const [qrCodeDesc, setQrCodeDesc] = useState<string>('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            history.push('/login');
        }

    }, []);

    useEffect(() => {
        api.get(`packages/${id}`).then(res => {
            setProduct(res.data);

        })
    }, [id]);

    useEffect(() => {
        const hash = crypto.randomBytes(2).toString('hex') + '-' + Date.now();

        setProtocol(hash);

        setQrCodeDesc(hash + ';' + product.trackerNumber);

    }, [product]);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {

        const { name, value } = event.target;

        setFormData({
            ...formData, [name]: value
        });

    }

    async function handleDeliverPackage(id: string) {

        await api.put(`packages/${id}/delivery`, formData)
            .then(res => {

                setProduct(res.data);

                toast.success('Mercadoria entregue com sucesso');
                handleGoBack();
            });
    }

    const handleGoBack = () => {
        history.goBack();
    }

    return (
        <PageDefault>
            <div id="container-product">
                <div className="container-product-detail">
                    <div className="detail-product">
                        <div className="detail-product-title">
                            <h2>
                                {product.trackerNumber}
                            </h2>
                            <div className="image-mobile">
                                <a href={product.urlImage}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <FiDownload />
                                </a>
                            </div>
                        </div>
                        <p>Destinatário: {product.destinationName}</p>
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="docNumber">Número Documento</label>
                                <input type="text"
                                    name="docNumber"
                                    id="docNumber"
                                    autoComplete="off"
                                    value={formData.docNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="nameReceived">Recedor</label>
                                <input type="text"
                                    name="nameReceived"
                                    id="nameReceived"
                                    autoComplete="off"
                                    value={formData.nameReceived}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="detail-qrcode">
                        {product.trackerNumber ?
                            <QRCode value={qrCodeDesc}
                                size={180}
                                renderAs="svg"
                            />
                            :
                            ('')
                        }
                        <p><strong>{protocol}</strong></p>
                    </div>
                </div>
                <div className="buttons-footer">
                    <button onClick={handleGoBack}>
                        <FiChevronLeft />
                        Voltar
                        </button>
                    <div className="right-buttons-footer">
                        <a href={product.urlImage}
                            target="_blank"
                            rel="noopener noreferrer">
                            <FiDownload />
                            Imagem
                            </a>
                        <button onClick={() => handleDeliverPackage(product.id)}>
                            <FiCheck />
                            Entregar
                            </button>
                    </div>
                </div>
            </div>
        </PageDefault>
    );
}

export default Product;