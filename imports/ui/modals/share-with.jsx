import React, { Fragment, useState, useEffect } from 'react';
import { Accounts } from 'meteor/accounts-base';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Space from 'antd/lib/space';
import message from 'antd/lib/message';
import Collapse from 'antd/lib/collapse';
import Select from 'antd/lib/select';
import Typography from 'antd/lib/typography';

const { Text } = Typography;

import ShareAltOutlined from '@ant-design/icons/ShareAltOutlined';
import UserAddOutlined from '@ant-design/icons/UserAddOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';

import { ModalBackground } from '../components/ModalBackground';
import { UserSearchInput } from '../components/UserSearchInput';
import { InvitableRoles } from '../components/invitable-roles';
import { hasPermission } from '../../api/helpers/roles';
import { useOpinionDetailsSpellcheck } from '../../client/trackers';

const { useForm } = Form;
const { Option } = Select;
const { Panel } = Collapse;


/*const ShareWithForm = ({ validateFields, resetFields }) => {
    const [ form ] = useForm();

    return (
        <Form
            layout="vertical"
            form={form}
        >
            <Form.Item
                label="Benutzer"
                name="user"
                rules={[{
                        required: true,
                        message: 'Bitte wählen Sie einen Benutzer aus.',
                }]}
            >
                <UserSearchInput refOpinion={'notsupported'} searchMethod="getAll" />
            </Form.Item>
        </Form>
    );
}*/

export const ModalShareWith = ( { refOpinion, canShareWithExplicitRole=false } ) => {
    const [ showModal, setShowModal ] = useState(false);
    const [ activePanel, setActivePanel ] = useState('INVITE-USER');

    const [ explicitInvitableRoles, setExplicitInvitableRoles ] = useState([]);
    const [ explicitInvitableRolesLoading, setExplicitInvitableRolesLoading ] = useState(true);

    const [ invRoles, setInvRoles ] = useState([]);

    const [ form ] = useForm();

    const closeDialog = e => {
        form.resetFields();

        setShowModal(false);
    }

    const showDialog = e => {
        e.preventDefault();

        setShowModal(true);
    }

    useEffect( () => {
        if (canShareWithExplicitRole) {
            Meteor.call('users.getExplicitInvitableRoles', refOpinion, (err, roles) => {
                if (!err) {
                    setExplicitInvitableRoles(roles);
                    setExplicitInvitableRolesLoading(false);
                } else {
                    setExplicitInvitableRolesLoading(false);
                    console.log(err)
                }
            });
        } else {
            setExplicitInvitableRolesLoading(false);
        }

        Meteor.call('users.getInvitableRoles', (err, roles) => {
            if (!err) {
                setInvRoles( roles );
            } else {
                console.log(err)
            }
        });
    }, []);

    const handleOk = e => {
        if (activePanel == 'INVITE-USER') {
            form.validateFields(['user', 'explicitRole']).then( values => {
                const { user, explicitRole } = values;

                Meteor.call('users.shareWith', refOpinion, {user, explicitRole}, err => {
                    if (err) {
                        return Modal.error({
                            title: 'Fehler',
                            content: 'Es ist ein Fehler aufgetreten.\n' + err.message,
                        });
                    }
                    closeDialog();
                });
            });
        } else {
            form.validateFields(['email', 'gender', 'firstName', 'lastName', 'roles']).then( values => {
                Meteor.call('users.inviteUser', refOpinion, values, err => {
                    if (err) {
                        return Modal.error({
                            title: 'Fehler',
                            content: 'Es ist ein Fehler aufgetreten.\n' + err.message,
                        });
                    }
                    closeDialog();
                });
            });
        }
    }

    return (
        <Fragment>
            <Button type="dashed" onClick={ showDialog }>
                <Space>
                    <ShareAltOutlined />
                    Dokument teilen
                </Space>
            </Button>

            { !showModal ? null :
                <ModalBackground>
                    <Modal
                        title={<span><ShareAltOutlined /> Dokument teilen</span>}
                        open={ showModal }
                        onOk={ handleOk }
                        onCancel={ closeDialog }
                        maskClosable={false}
                    >
                        <Form 
                            layout="vertical"
                            form={form}
                        >
                            <Collapse ghost accordion bordered={false} defaultActiveKey={['INVITE-USER']} onChange={p=>setActivePanel(p)}>
                                <Panel key="INVITE-USER" header={<span>aktiven Benutzer einladen</span>}>
                                    <p>
                                        Zum Teilen dieses Dokuments mit anderen Benutzern wählen Sie bitte den entsprechenden Benutzer aus.
                                    </p>
                                    
                                    <Form.Item
                                        label="Benutzer"
                                        name="user"
                                        rules={[{
                                                required: true,
                                                message: 'Bitte wählen Sie einen Benutzer aus.',
                                        }]}
                                    >
                                        <UserSearchInput refOpinion={'notsupported'} searchMethod="getAll" />
                                    </Form.Item>
                                    { !canShareWithExplicitRole ? null :
                                        <div style={{marginLeft: 32, marginTop:8, marginBottom:8}}>
                                            <Form.Item
                                                label="Explizite Rolle"
                                                name="explicitRole"
                                                rules={[{ required: false }]}
                                                style={{marginBottom:0}}
                                            >
                                                <Select allowClear>
                                                    {explicitInvitableRoles.map( r => <Option key={r.roleId}>{r.displayName}</Option>)}
                                                </Select>
                                            </Form.Item>
                                            <Text type="secondary" style={{fontSize:10}}>
                                                Sie können auch mit erweiterter Berechtigung dieses Dokument teilen. Wählen Sie hierzu eine entsprechende Rolle aus
                                                und berechtigen Sie damit den Benutzer im Besonderen.
                                            </Text>
                                        </div>
                                    }
                                </Panel>

                                <Panel key="INVITE-BYMAIL" header={<span><strong>Benutzer nicht gefunden?</strong> Dann laden Sie hier die entsprechende Person per E-Mail ein.</span>}>
                                    <Form.Item
                                        label="E-Mail"
                                        name="email"
                                        rules={[{
                                            type: 'email',
                                            message: 'Bitte geben Sie eine gültige E-Mail Adresse ein!',
                                          },{
                                            required: true,
                                            message: 'Bitte geben Sie die E-Mail Adresse ein.',
                                        }]}
                                    >
                                        <Input prefix={<MailOutlined />} />
                                    </Form.Item>

                                    <Form.Item
                                        label="Anrede"
                                        name="gender"
                                        rules={[{
                                            required: true,
                                            message: 'Bitte wählen Sie eine Anrede aus.',
                                        }]}
                                    >
                                        <Select>
                                            <Option key="Herr">Herr</Option>
                                            <Option key="Frau">Frau</Option>
                                            <Option key="divers">Divers</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="Vorname"
                                        name="firstName"
                                        rules={[{
                                            required: true,
                                            message: 'Bitte geben Sie den Vornamen ein.',
                                        }]}
                                    >
                                        <Input prefix={<UserAddOutlined />} />
                                    </Form.Item>

                                    <Form.Item
                                        label="Nachname"
                                        name="lastName"
                                        rules={[{
                                            required: true,
                                            message: 'Bitte geben Sie den Nachnamen ein.',
                                        }]}
                                    >
                                        <Input prefix={<UserAddOutlined />} />
                                    </Form.Item>

                                    <Form.Item
                                        name="roles"
                                    >
                                        <InvitableRoles iInvRoles={invRoles} />
                                        
                                    </Form.Item>
                                </Panel>
                            </Collapse>
                        </Form>
                    </Modal>
                </ModalBackground>
            }
        </Fragment>
    );
}
