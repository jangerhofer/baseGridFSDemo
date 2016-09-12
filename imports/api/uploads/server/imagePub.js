import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import Grid from 'gridfs-stream';
import { MongoInternals } from 'meteor/mongo';
import fs from 'fs';

// Makes GridFS service available in this file
const gfs = Grid(
    MongoInternals.defaultRemoteCollectionDriver().mongo.db,
    MongoInternals.NpmModule
  );

// Set up server-side collection of uploads
const UploadedImages = new FilesCollection({
  collectionName: 'UploadedImages',
  // Verify validity of the file before beginning the upload
  onBeforeUpload(file) {
    // Ensure image size is smaller, in bytes, than 25 MB
    if (file.size > 26214400) {
      return 'Image is too large.  Please upload a smaller image file.';
    }
    // Check that uploaded file is an image in a proper format
    else if (!/png|jpg|jpeg/i.test(file.extension)) {
      return 'Please upload a valid image file.';
    }
    return true;
  },
  onAfterUpload(image) {
    // Move file to GridFS
    Object.keys(image.versions).forEach(versionName => {
      const metadata = { versionName, imageId: image._id, storedAt: new Date() }; // Optional
      const writeStream = gfs.createWriteStream({ filename: image.name, metadata });

      fs.createReadStream(image.versions[versionName].path).pipe(writeStream);

      writeStream.on('close', Meteor.bindEnvironment(file => {
        const property = `versions.${versionName}.meta.gridFsFileId`;

        // If we store the ObjectID itself, Meteor (EJSON?) seems to convert it to a
        // LocalCollection.ObjectID, which GFS doesn't understand.
        this.collection.update(image._id, { $set: { [property]: file._id.toString() } });
        this.unlink(this.collection.findOne(image._id), versionName); // Unlink files from FS
      }));
    });
  },
  interceptDownload(http, image, versionName) {
    // Serve file from GridFS rather than the file system
    const _id = (image.versions[versionName].meta || {}).gridFsFileId;
    if (_id) {
      const readStream = gfs.createReadStream({ _id });
      readStream.on('error', err => { throw err; });
      readStream.pipe(http.response);
    }
    return Boolean(_id); // Serve file from either GridFS or FS if it wasn't uploaded yet
  },
  onAfterRemove(images) {
    // Clean up by removing the corresponding file from GridFS
    images.forEach(image => {
      Object.keys(image.versions).forEach(versionName => {
        const _id = (image.versions[versionName].meta || {}).gridFsFileId;
        if (_id) gfs.remove({ _id }, err => { if (err) throw err; });
      });
    });
  },

});

// Prevent client from tampering with uploads collection
UploadedImages.denyClient();

// Publish collection of uploads
Meteor.publish('UploadedImages', () => UploadedImages.find().cursor);
