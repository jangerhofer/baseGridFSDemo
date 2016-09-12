import { composeWithTracker } from 'react-komposer';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';
import UploadedImages from '../../api/uploads/client/imageSub';
import UploadList from '../components/uploadList';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('UploadedImages');
  if (subscription.ready()) {
    let resArr = [];
    // Loop over all uploads in subscription and only pass what we need to the presentational component
    UploadedImages.find().forEach((fileRef) => {
      resArr.push({
        link: UploadedImages.link(fileRef),
        name: fileRef.name,
        ownerID: fileRef.userId,
      });
    });
    onData(null, { images: resArr });
  }
};

export default composeWithTracker(composer, Loading)(UploadList);
