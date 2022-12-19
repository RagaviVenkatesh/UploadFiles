// @ts-nocheck
/** @file component used for uploading files */
import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Upload,
  Card,
  Button,
  Modal,
  Space,
  Select,
  Progress,
  Empty,
  Tooltip,
} from 'antd';
import { FileJpgOutlined, CheckOutlined } from '@ant-design/icons';
import './upload-files.scss';
import {
  CaretDownIcon,
  PdfIcon,
  PptIcon,
  XmlIcon,
  DocIcon,
  ClearIcon,
} from '../../CustomIcons/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getProjectSettingsAssetTypesAction } from '../../../redux/actions/project-settings';
import { errorMessage } from '../../../utils/alert';

const initialUploadModalState = {
  fileList: [],
  state: 'initial',
  title: 'Upload files',
};

const fileIcons = {
  jpg: <FileJpgOutlined className="text-neutral-5 font-16" />,
  JPG: <FileJpgOutlined className="text-neutral-5 font-16" />,
  png: <FileJpgOutlined className="text-neutral-5 font-16" />,
  PNG: <FileJpgOutlined className="text-neutral-5 font-16" />,
  jpeg: <FileJpgOutlined className="text-neutral-5 font-16" />,
  JPEG: <FileJpgOutlined className="text-neutral-5 font-16" />,
  ppt: <PptIcon className="text-neutral-5 font-16" />,
  PPT: <PptIcon className="text-neutral-5 font-16" />,
  pptx: <PptIcon className="text-neutral-5 font-16" />,
  PPTX: <PptIcon className="text-neutral-5 font-16" />,
  pdf: <PdfIcon className="text-neutral-5 font-16" />,
  PDF: <PdfIcon className="text-neutral-5 font-16" />,
  xml: <XmlIcon className="text-neutral-5 font-16" />,
  XML: <XmlIcon className="text-neutral-5 font-16" />,
  doc: <DocIcon className="text-neutral-5 font-16" />,
  DOC: <DocIcon className="text-neutral-5 font-16" />,
  docx: <DocIcon className="text-neutral-5 font-16" />,
  DOCX: <DocIcon className="text-neutral-5 font-16" />,
};

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
const uploadFiles = (props) => {
  const dispatch = useDispatch();
  const { Dragger } = Upload;
  const { visible, handleClose, handleUpload } = props;
  const { Option } = Select;
  const [loading, setLoding] = useState(10);
  const assetType = useSelector(
    (state: any) => state.ProjectSettings.assetTypes,
  );
  const [uploadModalState, setUploadModalState] = useState(
    initialUploadModalState,
  );
  const [selectedFileList, setSelectedFileList] = useState([]);
  /**
   * Function is called on click `Upload files` button.
   * It will open Upload files model
   */
  const handleOnUpload = () => {
    setUploadModalState({
      ...uploadModalState,
      title: 'Uploading...',
      state: 'pending',
    });
    const interval = setInterval(() => {
      setLoding((oldLoading) => {
        const l = oldLoading + 20;
        if (l >= 100) {
          clearInterval(interval);
        }
        return l;
      });
    }, 250);
    setTimeout(() => {
      setUploadModalState({
        ...uploadModalState,
        title: 'Upload Complete',
        state: 'finished',
      });
    }, 3000);
  };

  useEffect(() => {
    dispatch(getProjectSettingsAssetTypesAction.request());
  }, []);

  /**
   * Function is called when a file is selected
   *
   * @param {Object} files - List of selected files
   */
  const handleOnFileSelected = (files) => {
    let fileNameExist: any = {};
    let isFileDuplicated: boolean = false;
    if (uploadModalState?.fileList?.[0]) {
      let filesLength = uploadModalState.fileList.length;
      for (let a = 0; a < filesLength; a++) {
        if (fileNameExist[uploadModalState.fileList[a]?.name]) {
          isFileDuplicated = true;
        } else {
          fileNameExist[uploadModalState.fileList[a]?.name] = true;
        }
      }
    }
    const selectedFiles = files.fileList.map((file) => {
      if (fileNameExist[file.name]) {
        isFileDuplicated = true;
      } else {
        fileNameExist[file.name] = true;
      }
      const f = {
        ...file,
        type: null,
      };
      return f;
    });
    if (isFileDuplicated) {
      errorMessage({ content: 'File duplicated' });
      setSelectedFileList([]);
      return null;
    }
    setUploadModalState({
      ...uploadModalState,
      fileList: [...uploadModalState.fileList, ...selectedFiles],
    });
    setSelectedFileList([]);
  };

  /**
   * Function is called on click `Done` button.
   * It will Close Upload files model
   */
  const handleDone = () => {
    handleUpload(uploadModalState);
    handleClose();
  };
  /**
   * A utility function to deep clone the given array.
   *
   * @param {Array} arr - Array to be deep cloned.
   * @returns {Array} Returns deep cloned array
   */
  const deepCopy = (arr) =>
    Array.isArray(arr) ? arr.map((a) => ({ ...a })) : [];

  /**
   * Function returns whether the field has error
   *
   * @returns {boolean} Fields error or not
   */
  const isFieldHasError = () => {
    for (let index = 0; index < uploadModalState.fileList.length; index++) {
      const element = uploadModalState.fileList[index];
      if (!element.originFileObj || !element.type) {
        return true;
      }
    }
    if (
      uploadModalState.fileList.length == 0 ||
      uploadModalState.fileList[0] === undefined ||
      uploadModalState.fileList[0].originFileObj === null ||
      uploadModalState.fileList[0].type === null
    ) {
      return true;
    }
    return false;
  };

  return (
    <Modal
      title={uploadModalState.title}
      visible={visible}
      footer={false}
      width="600px"
      mask
      maskClosable={false}
      onCancel={handleClose}
      afterClose={() => setUploadModalState({ ...initialUploadModalState })}
      className="upload-files-modal-container"
      closeIcon={<ClearIcon className="font-16" />}>
      {uploadModalState.state === 'pending' && (
        <div
          style={{
            position: 'relative',
            border: '1px solid #424B57',
            borderRadius: '2px',
          }}>
          <span
            style={{
              position: 'absolute',
              zIndex: 1,
              top: '25px',
              left: '20px',
            }}>
            {`Uploading ${uploadModalState.fileList?.length} files...`}
          </span>
          <Progress
            percent={loading}
            className="uploadfile"
            showInfo={false}
            strokeColor="rgb(76, 145, 201, 0.25)"
          />
        </div>
      )}
      {uploadModalState.state === 'initial' && (
        <>
          {uploadModalState.fileList.length === 0 && (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
          {uploadModalState.fileList.map((file, i) => (
            <Row
              style={{ width: '100%' }}
              className="mb-4"
              justify="space-between"
              align="middle">
              <Col style={{ maxWidth: '50%', display: 'flex' }}>
                <div>{fileIcons[file.name.split('.').pop()]}</div>
                <div style={{ maxWidth: '100%' }}>
                  <Tooltip placement="topLeft" title={file.name}>
                    <div
                      style={{ display: 'grid', placeItems: 'stretch' }}
                      className="ml-3">
                      <div
                        style={{
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                        }}>
                        {file.name}
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </Col>
              <Col style={{ maxWidth: '50%' }}>
                <Select
                  placeholder="Select file type"
                  className="input text-neutral-2 delphi-btn-block"
                  style={{ width: 200 }}
                  value={file.type}
                  onChange={(val) => {
                    const f = deepCopy(uploadModalState.fileList);
                    f[i].type = val;
                    setUploadModalState({
                      ...uploadModalState,
                      fileList: [...f],
                    });
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
              <Col>
                <ClearIcon
                  onClick={() => {
                    const f = deepCopy(uploadModalState.fileList);
                    setUploadModalState({
                      ...uploadModalState,
                      fileList: f.filter((v, index) => index !== i),
                    });
                  }}
                />
              </Col>
            </Row>
          ))}
          <Row className="upload-container">
            <Col xs={24} sm={24} md={24}>
              <Dragger
                fileList={selectedFileList}
                onChange={handleOnFileSelected}
                multiple
                showUploadList={false}
                accept=".pdf, .doc, .docx, .jpg, .png, .jpeg, .xml,  .msg, ppt, pptx, vsd, vsdx">
                <div className="dragger-button">
                  <p className="text-neutral-2">Drag & drop files</p>
                  <p className="text-neutral-4">Browse files</p>
                </div>
              </Dragger>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* <div className="font-12 mt-3 text-neutral-4 mb-2">
                Only JPG, PNG, PDF, XML and DOC files are supported.
              </div> */}
              <div className="font-12 mt-3 text-neutral-4 mb-2">
                MAXIMUM FILE SIZE: 200MB
              </div>
            </Col>
          </Row>
        </>
      )}
      {uploadModalState.state === 'finished' && (
        <>
          {uploadModalState.fileList.map((file) => (
            <Card className="mb-5 upload-complete-card">
              <Row justify="space-between" className="delphi-btn-block">
                <Col>
                  <div>
                    {fileIcons[file.name.split('.').pop()]}
                    <span className="ml-3">{file.name}</span>
                  </div>
                </Col>
                <Col>
                  <CheckOutlined className="text-primary-5" />
                </Col>
              </Row>
            </Card>
          ))}
        </>
      )}
      <Row className="upload-actions">
        <Space size="small">
          {uploadModalState.state === 'initial' && (
            <Button
              type="primary"
              onClick={handleOnUpload}
              disabled={isFieldHasError()}>
              Upload files
            </Button>
          )}
          {uploadModalState.state === 'finished' && (
            <Button
              onClick={handleDone}
              disabled={uploadModalState.state === 'pending'}
              type="primary">
              Done
            </Button>
          )}
          {uploadModalState.state === 'initial' && (
            <Button onClick={handleClose} type="text">
              Cancel
            </Button>
          )}
        </Space>
      </Row>
    </Modal>
  );
};

export default uploadFiles;
