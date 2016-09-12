import React from 'react';
import { Panel } from 'react-bootstrap';

const UploadList = ({ images }) => {
  return (
    <ul id="uploadList">
    {images.map((image, i) => {
      // Cheat on the key -- it should be something not tied to order for optimal performance on re-renders
      return <li key={i}>
      <Panel header={image.name + ' -- ' + image.ownerID}>
      <img className="uploadedImage" src={image.link}/>
    </Panel>
      </li>;
    })}
    </ul>
  );
};

export default UploadList;
