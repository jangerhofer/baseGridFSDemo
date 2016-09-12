import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import DZ from 'react-dropzone';
import UploadedImages from '../../api/uploads/client/imageSub';

// Function for handling file selection
const onDrop = (files) => {
  const upload = UploadedImages.insert({
    file: files[0],
    streams: 'dynamic',
    chunkSize: 'dynamic',
    meta: {
      // User ID is already stored in the [document].userId field by package defaults, so this is meant to be illustrative of how to store additional data with the upload
      ownerId: Meteor.userId(),
    },
  }, false);

/*
  upload.on('start', function () {
    // `this` object contains continuously updated information on the upload
    // including approximate upload speed, estimated time remaining, etc.
  });
*/

  // When upload finishes, display a message
  upload.on('end', function (error, fileObj) {
    if (error) {
      Bert.alert('Error during upload: ' + error, 'warning');
    } else {
      Bert.alert('File "' + fileObj.name + '" successfully uploaded', 'success');
    }
  });

  // Kick off the upload
  upload.start();
};

const DropZone = () => (
  <DZ id="dz" onDrop={onDrop} multiple={false} accept={"image/*"} className={'dz-inactive'} activeClassName={'dz-active'}>
    <div>Drop an image here or click to select an image.</div>
  </DZ>
);

export default DropZone;
