import React from 'react';

import { ImageLine } from 'components/ImageLine';

import UploadWrapper from './UploadWrapper';
import { uploadFile } from './utils';

type StateType = {
  serverIsUp: boolean,
  items: Array<{ id: string, image: string }>,
};

class UploadTest extends React.Component<{}, StateType> {
  state = {
    items: [],
    serverIsUp: false,
  }

  componentDidMount() {
    this.handleCheckServer();
  }

  handleCheckServer = async () => {
    const health = await fetch('http://192.168.99.100:8010/healthcheck');
    const healthResult = await health.json();
    this.setState({
      serverIsUp: healthResult === 'Ok',
    });
  }

  handleOnUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (!result.url) return;
    this.setState({
      items: [
        ...this.state.items,
        {
          id: `${this.state.items.length + 1}`,
          image: result.url,
        },
      ],
    });
  }

  render() {
    const { items, serverIsUp } = this.state;
    return (
      <UploadWrapper
        isReady={serverIsUp}
        onUpload={this.handleOnUpload}
        buttonHeight={120}
        buttonWidth={120}
        buttonIconType="camera"
        buttonLabel="Добавить фото"
      >
        <ImageLine items={items} />
      </UploadWrapper>
    );
  }
}

export default UploadTest;
