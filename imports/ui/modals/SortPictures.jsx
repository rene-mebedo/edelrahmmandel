import React, { Fragment, useState } from 'react';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import Space from 'antd/lib/space';

import PictureOutlined from '@ant-design/icons/PictureOutlined';
import { useOpinionDetails } from '../../client/trackers';

import { ModalBackground } from '../components/ModalBackground';
import { ListOpinionDetails_ModalSort } from '../ListOpinionDetails/ListOpinionDetails_ModalSort';

export const ModalSortPictures = ( { refOpinion, refDetail }) => {
    const [ showModal, setShowModal ] = useState(false);
    const [ opinionDetails, isLoading ] = useOpinionDetails(refOpinion, refDetail);

    let pictureArray = opinionDetails.filter( opDetail => {
        return ( opDetail.type == 'PICTURE'
              && opDetail.refParentDetail == refDetail )
    });

    const closeModal = e => {
        setShowModal(false);
    }

    const showModalVisible = (e) => {
        e.stopPropagation();        

        setShowModal(true);
    }
    
    const ActionButton = () => {
        if ( pictureArray.length < 2 )
            return null;
        else
            return (
            <Button type="dashed" onClick={ showModalVisible }>
                <Space>
                    <PictureOutlined />
                    Sortieren
                </Space>
            </Button>
        )
    }

    return (
        <Fragment>
            <ActionButton />

            { !showModal ? null :
                <ModalBackground>
                    <Modal
                        className="mbac-modal-upload-pictures"
                        title="Reihenfolge der Bilder anpassen durch Verschieben"
                        open={ showModal }
                        onOk={ closeModal }
                        onCancel={ closeModal }
                        cancelButtonProps={{className:"mbac-btn-cancel"}}
                        okText="Schließen"
                        maskClosable={false}
                    >
                    <ListOpinionDetails_ModalSort pictures={pictureArray} />
                    </Modal>
                </ModalBackground>
            }
        </Fragment>
    );
}