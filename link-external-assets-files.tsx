// @ts-nocheck
/** @file component used for linking external files */
import React, { useState } from 'react';
import { Row, Col, Button, Modal, Space, Select, Input, Empty } from 'antd';
import './upload-files.scss';
import {
  AddIcon,
  CaretDownIcon,
  ClearIcon,
  LinkIcon,
} from '../../CustomIcons/icons';
import { useSelector } from 'react-redux';

/**
 * @typedef {any} Component
 */
/**
 * Component for displaying upload file model
 *
 * @param {object} props - Accepts -
 *
 * `visible` -Set visiblity of the modal.
 *
 * `handleClose` -Function called when the modal closed.
 * @returns {Component} `JSX.Element`
 */
const LinkExternalAssetsFiles = (props) => {
  const { data, visible, handleCloseModal, handleUpdate } = props;
  // const [fileData, setFileData] = useState(data);
  const [fileData, setFileData] = useState([]);
  const { Option } = Select;
  const assetType = useSelector(
    (state: any) => state.ProjectSettings.assetTypes,
  );
  /**
   * A utility function to deep clone the given array.
   *
   * @param {Array} arr - Array to be deep cloned.
   * @returns {Array} Returns deep cloned array
   */
  const deepCopy = (arr) =>
    Array.isArray(arr) ? arr.map((a) => ({ ...a })) : [];
  /**
   * Function is called on click `Done` button.
   * It will Close Upload files model
   */
  const handleClose = () => {
    setFileData([]);
    handleCloseModal();
  };

  const handleAddLink = () => {
    const newFileData = {
      url: null,
      type: null,
    };
    setFileData(fileData.concat(newFileData));
  };

  function isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
  }

  function isValidExtension(url) {
    if (!isValidHttpUrl(url)) {
      return (
        url.split('.').pop().toLowerCase() === 'jpg' ||
        url.split('.').pop().toLowerCase() === 'png' ||
        url.split('.').pop().toLowerCase() === 'ppt' ||
        url.split('.').pop().toLowerCase() === 'pptx' ||
        url.split('.').pop().toLowerCase() === 'pdf' ||
        url.split('.').pop().toLowerCase() === 'xml' ||
        url.split('.').pop().toLowerCase() === 'doc' ||
        url.split('.').pop().toLowerCase() === 'docx'
      );
    }
    return true;
  }

  /**
   * Function returns whether the field has error
   *
   * @returns {boolean} Fields error or not
   */
  const isFieldHasError = () => {
    for (let index = 0; index < fileData.length; index++) {
      const element = fileData[index];
      if (
        !element.url ||
        !element.type ||
        !isValidHttpUrl(element.url) ||
        !isValidExtension(element.url)
      ) {
        return true;
      }
    }
    return false;
  };

  const linkFiles = () => {
    handleUpdate(fileData);
    setFileData([]);
  };

  return (
    <Modal
      title="Link external files"
      visible={visible}
      footer={false}
      width="800px"
      mask
      maskClosable={false}
      onCancel={handleClose}
      afterClose={handleClose}
      className="link-external-assets-files"
      closeIcon={<ClearIcon className="font-16" />}>
      {fileData.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      {fileData.map((file, i) => (
        <Row
          style={{ width: '100%' }}
          className="mb-4"
          justify="space-between"
          align="middle"
          gutter={24}>
          <Col span={12}>
            <div>
              <Input
                placeholder="Insert a file URL"
                suffix={<LinkIcon className="font-16 text-neutral-5" />}
                onChange={(e) => {
                  const f = deepCopy(fileData);
                  f[i].url = e.target.value;
                  setFileData([...f]);
                }}
                value={file.url}
                className="link-file-url-input"
              />
            </div>
          </Col>
          <Col span={12}>
            <Select
              placeholder="Select file type"
              className="input text-neutral-2 delphi-btn-block"
              style={{ width: '100%' }}
              value={file.type}
              onChange={(val) => {
                const f = deepCopy(fileData);
                f[i].type = val;
                setFileData([...f]);
              }}
              suffixIcon={<CaretDownIcon className="font-16" />}
              showSearch>
              {assetType.map((option, index) => (
                <Option key={index} value={option.name}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      ))}
      <div className="border-top pt-3 pb-3">
        <Button
          onClick={handleAddLink}
          className="text-neutral-4 add-link-btn"
          type="text"
          icon={<AddIcon />}>
          Add link
        </Button>
      </div>
      <Row className="actions">
        <Space size="small">
          <Button
            onClick={linkFiles}
            disabled={isFieldHasError()}
            type="primary">
            Link external files
          </Button>
          <Button onClick={handleClose} type="text">
            Cancel
          </Button>
        </Space>
      </Row>
    </Modal>
  );
};

export default LinkExternalAssetsFiles;
