'use client';

import { useState } from 'react';
import { Button } from './Button';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '@/i18n';

interface DeleteComponentProps {
    itemName: string;
    onDelete: () => void | Promise<void>;
    buttonText?: string;
    buttonVariant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
}

export default function DeleteComponent({ 
    itemName, 
    onDelete,
    buttonText,
    buttonVariant = "destructive"
}: DeleteComponentProps) {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await Promise.resolve(onDelete());
            setShowModal(false);
        } catch (error) {
            console.error('Silme işlemi başarısız:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Button
                variant={buttonVariant}
                size="sm"
                onClick={() => setShowModal(true)}
            >
                <i className="feather-trash-2 me-1"></i>
                {buttonText || t('common.delete') || 'Sil'}
            </Button>

            {showModal && (
                <div
                    className="modal fade show d-block"
                    style={{ zIndex: 1050 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowModal(false);
                        }
                    }}
                >
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {t('common.delete') || 'Silme İşlemini Onayla'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                    disabled={isDeleting}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    <strong>{itemName}</strong> öğesini silmek istediğinizden emin misiniz?
                                    Bu işlem geri alınamaz.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                    disabled={isDeleting}
                                >
                                    {t('common.cancel') || 'İptal'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <LoadingSpinner size="sm" color="white" />
                                            <span className="ms-2">Siliniyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="feather-trash-2 me-1"></i>
                                            {t('common.delete') || 'Sil'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
