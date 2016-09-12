import { FilesCollection } from 'meteor/ostrio:files';

// Set up the collection of uploaded files that will be filled by a subscription
const UploadedImages = new FilesCollection({
  collectionName: 'UploadedImages',
});

export default UploadedImages;
