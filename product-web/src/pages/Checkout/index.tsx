import React, { ChangeEvent, useState, FormEvent, useEffect } from 'react';
import { FiSearch, FiCheckCircle, FiDownload } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import './styles.css';
import api from '../../services/api';
import Toast from '../../components/Toast';
import PageDefault from '../../components/PageDefault';

interface Product {
    id: String;
    trackerNumber: string;
    destinationName: string;
    status: string;
    description: string;
    imageKey: string;
    urlImage: string;
    createAt: Date;
}

interface PaginationInfo {
    total: number;
    lastPage: number;
    perPage: number;
    currentPage: number;
}

const Checkout = () => {

    const history = useHistory();
    const [pagination, setPagination] = useState<PaginationInfo>({ currentPage: 1 } as PaginationInfo);
    const [packages, setPackages] = useState<Product[]>([]);

    const [formData, setFormData] = useState({
        trackerNumber: '',
        destinationName: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            history.push('/login');
        }

    }, []);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {

        const { name, value } = event.target;

        setFormData({
            ...formData, [name]: value
        });

    }

    async function searchPackages(page: number) {
        const { trackerNumber, destinationName } = formData;
        setPackages([]);
        setPagination({} as PaginationInfo);

        if (trackerNumber.trim() === '' &&
            destinationName.trim() === '') {
            toast.error(<Toast msg="Favor preencher pelo menos um dos campos." icon="erro" />);
            return;
        }

        await api.get('packages', {
            params: {
                page,
                trackerNumber,
                destinationName,
            }
        }).then(res => {


            const { data, pagination } = res.data;
            setPackages(data);
            setPagination({ ...pagination, pagination });

        }).catch(err => {
            if (err.response) {

                toast(<Toast msg={err.response.data.message} icon="info" />);
            }
        });
    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        searchPackages(1);
    }

    const handlePrevPage = () => {
        const { currentPage } = pagination;

        if (currentPage === 1) {
            return;
        }

        const pagenumber = +currentPage - 1;

        searchPackages(pagenumber);
    };

    const handleNextPage = () => {

        const { currentPage } = pagination;

        if (currentPage === pagination.lastPage) {
            return;
        }
        const pagenumber = +currentPage + 1;

        searchPackages(pagenumber);
    };

    return (
        <PageDefault>
            <div id="container-checkout">
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>
                            <h2>
                                Saída de Mercadoria
                            </h2>
                        </legend>
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="trackerNumber">Rastreador</label>
                                <input type="text"
                                    name="trackerNumber"
                                    id="trackerNumber"
                                    autoComplete="off"
                                    value={formData.trackerNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="destinationName">Nome do Destinatário</label>
                                <input type="text"
                                    name="destinationName"
                                    id="destinationName"
                                    autoComplete="off"
                                    value={formData.destinationName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit">
                                <FiSearch />
                            </button>
                        </div>
                    </fieldset>
                </form>
                <div className={packages.length === 0 ? 'list-mercadorias-disabled' : 'list-mercadorias'}>

                    <fieldset>
                        <legend>
                            <h2>
                                Mercadorias
                            </h2>
                        </legend>
                        <div className="product-list">
                            {packages.map((product: Product) => (
                                <article key={product.id as any}>
                                    <div className="card-header">
                                        <strong>{product.trackerNumber}</strong>
                                    </div>
                                    <div className="card-content">
                                        <h2>{product.destinationName}</h2>
                                        <p>{product.description}</p>
                                        <div className="buttons-content">
                                            <a href={product.urlImage} target="_blank" rel="noopener noreferrer">
                                                <FiDownload />
                                                <strong>Imagem</strong>
                                            </a>
                                            {product.status.toUpperCase() === 'received'.toUpperCase() ?
                                                <Link to={`/products/${product.id}`} >Entregar</Link>
                                                :
                                                <div className="checkout">
                                                    <FiCheckCircle />
                                                    <strong>Entregue</strong>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </fieldset>
                </div>
                <div className={pagination.total > 10 ? "actions" : "actions-disabled"}>
                    <button disabled={pagination.currentPage === 1}
                        onClick={handlePrevPage}>Previous</button>
                    <button disabled={pagination.currentPage === pagination.lastPage}
                        onClick={handleNextPage}>Next</button>
                </div>
            </div>
        </PageDefault>
    );
}

export default Checkout;