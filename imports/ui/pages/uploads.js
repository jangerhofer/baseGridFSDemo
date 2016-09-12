import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DropZone from '../components/dropzone';
import UploadList from '../containers/uploadList';

export const Uploads = () => (
  <Row>
    <Col xs={ 12 }>
      <h4 className="page-header">Upload New Image</h4>
      <DropZone />
      <hr/>
      <h4 className="page-header">User Uploads</h4>
      <UploadList />
    </Col>
  </Row>
);
