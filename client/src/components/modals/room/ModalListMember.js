import React, { Component } from 'react';
import { Modal, Avatar } from 'antd';
import ListMember from './../../../pages/rooms/ListMember';
import avatarConfig from '../../../config/avatar';

class ModalListMember extends Component {
  state = {
    visible: false,
  };

  showListMember = () => {
    this.setState({
      visible: true,
    });
  };

  handleHiddenListMember = e => {
    this.setState({
      visible: false,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <React.Fragment>
        <Avatar size={avatarConfig.AVATAR.SIZE.SMALL} className="list-member-chat-room" onClick={this.showListMember}>
          +{this.props.numRemainMember}
        </Avatar>
        <Modal visible={this.state.visible} onCancel={this.handleHiddenListMember} footer={null} width="550px">
          {this.state.visible === true ? <ListMember handleOk={this.handleOk} /> : ''}
        </Modal>
      </React.Fragment>
    );
  }
}

export default ModalListMember;
