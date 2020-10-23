import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
    onFileUploaded: (file: File) => void;
    selectedFileUrl: string;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded, selectedFileUrl }) => {

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        onFileUploaded(file);

    }, [onFileUploaded]);
    
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*'
    });

    return (
        <div id="container-dropzone">
            <div className="dropzone" {...getRootProps()}>
                <input {...getInputProps()} accept="image/*" />

                {selectedFileUrl
                    ? <img src={selectedFileUrl} alt="Package thumbnail" />
                    :
                    <p>
                        <FiUpload />
                        Imagem
                    </p>
                }
            </div>
        </div>
    )
}

export default Dropzone;