import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import './styles.css';
import api from '../../services/api';
import Dropzone from '../../components/Dropzone';
import Toast from '../../components/Toast';
import PageDefault from '../../components/PageDefault';

const Checkin = () => {

    const history = useHistory();
    const [selectedFile, setSelectedFile] = useState<File>();
    const [selectedFileUrl, setSelectedFileUrl] = useState('');
    const [formData, setFormData] = useState({
        trackerNumber: '',
        title: '',
        description: '',
        destinationName: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            history.push('/login');
        }

    }, []);

    useEffect(() => {

        if (selectedFile) setSelectedFileUrl(URL.createObjectURL(selectedFile));

    }, [selectedFile]);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {

        const { name, value } = event.target;

        setFormData({
            ...formData, [name]: value
        });
    }

    const resetForm = () => {

        setFormData({
            trackerNumber: '',
            title: '',
            description: '',
            destinationName: '',
        });
        setSelectedFile(undefined);
        setSelectedFileUrl('');
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { trackerNumber, title, description, destinationName } = formData;

        const data = new FormData();

        data.append('trackerNumber', trackerNumber);
        data.append('destinationName', destinationName);
        data.append('observation', description);

        if (selectedFile) {

            data.append('file', selectedFile);
        }

        await api.post('packages', data).then((res) => {
            toast.success(<Toast msg={res.data.message} icon="info" />);

        }).catch((err) => {

            if (err.response) {

                toast(<Toast msg={err.response.data.message} icon="info" />);
            }
        });
        resetForm();
    }

    return (
        <PageDefault>
            <div id="container-checkin">
                <form onSubmit={handleSubmit} onReset={resetForm}>
                    <fieldset>
                        <legend>
                            <h2>
                                Entrada de Mercadoria
                            </h2>
                        </legend>
                        <div className="field-group-container">
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
                                <div className="field">
                                    <label htmlFor="description">Descrição / Obeservação</label>
                                    <input type="text"
                                        name="description"
                                        id="description"
                                        autoComplete="off"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="dropzone-container">
                                <Dropzone selectedFileUrl={selectedFileUrl} onFileUploaded={setSelectedFile} />
                            </div>
                        </div>
                    </fieldset>
                    <button type="submit">Registrar</button>
                </form>
            </div>
        </PageDefault>
    );
}

export default Checkin;