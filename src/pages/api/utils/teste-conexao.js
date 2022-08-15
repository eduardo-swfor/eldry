/*
import aws from 'aws-sdk'
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const bucketParams = {
  Bucket: "example-space-name",
  Key: "file.ext"
};

// Generates the URL.
export const run = async () => {
  try {
    const url = await getSignedUrl(s3Client, new GetObjectCommand(bucketParams), { expiresIn: 15 * 60 }); // Adjustable expiration.
    console.log("URL:", url);
    return url;
  } catch (err) {
    console.log("Error", err);
  }
};
*/