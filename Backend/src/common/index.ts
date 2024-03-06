import { StatusCodes } from "http-status-codes";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import * as uuid from "uuid";
import { extname } from "path";

const internalServerError = () => {
  return {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "Internal server error",
    success: false,
  };
};
const badRequest = (message: string) => {
  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: message,
    success: false,
  };
};
const successRequest = (data?: any, message?: string) => {
  let obj = {
    statusCode: StatusCodes.OK,
    data: data,
    success: true,
  };
  if (message)
    obj = {
      statusCode: StatusCodes.OK,
      data: { message },
      success: true,
    };
  return obj;
};

async function uploadImage(
  file: {
    buffer: Buffer;
    fieldname: string;
    mimetype: string;
    originalname: string;
    size: number;
  },
  filePath?: string
): Promise<string> {
  let s3 = new S3Client({
    forcePathStyle: false,
    endpoint: `https://${process.env.CHATIFY_DEMO_BUCKET_URL}`,
    region: process.env.CHATIFY_DEMO_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.CHATIFY_DEMO_BUCKET_ACCESS_TOKEN ?? "",
      secretAccessKey: process.env.CHATIFY_DEMO_BUCKET_SECRET ?? "",
    },
  });
  // // Check if the MIME type is allowed
  // if (!allowedMimeTypes.includes(file.mimetype)) {
  //   throw new Error(
  //     "Invalid file MIME type. Only JPEG, PNG, and GIF images are allowed."
  //   );
  // }

  // Generate a unique filename with a UUID and file extension
  const fileExtension = extname(file.originalname).toLowerCase();
  const uniqueFilename = !filePath
    ? `"chatify-demo/${uuid.v4()}${fileExtension}` // chatify-demo is director name in your bucket (AWS S3, Digital Ocean Spaces)
    : filePath.endsWith("/")
    ? `${filePath}${uuid.v4()}${fileExtension}`
    : `${filePath}/${uuid.v4()}${fileExtension}`;

  // Convert the file data into a Readable stream
  const fileStream = new Readable();
  fileStream.push(file.buffer);
  fileStream.push(null);

  // Set up S3 parameters for the upload
  const params: any = {
    Bucket: process.env.CHATIFY_DEMO_BUCKET_NAME,
    Key: uniqueFilename,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  // Upload the file to S3
  await s3.send(new PutObjectCommand(params));

  return `https://${params.Bucket}.${process.env.CHATIFY_DEMO_BUCKET_URL}/${params.Key}`;
}
async function uploadImageFromBuffer(buffer: Buffer): Promise<string> {
  let s3 = new S3Client({
    forcePathStyle: false,
    endpoint: process.env.CHATIFY_DEMO_BUCKET_URL,
    region: process.env.CHATIFY_DEMO_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.CHATIFY_DEMO_BUCKET_ACCESS_TOKEN ?? "",
      secretAccessKey: process.env.CHATIFY_DEMO_BUCKET_SECRET ?? "",
    },
  });

  const uniqueFilename = `chatify-demo/${uuid.v4()}.png`;
  const params: any = {
    Bucket: process.env.CHATIFY_DEMO_BUCKET_NAME,
    Key: uniqueFilename,
    Body: buffer,
    ContentType: "image/png",
    ACL: "public-read",
  };

  // Upload the file to S3
  await s3.send(new PutObjectCommand(params));

  //https://dev-projects-bucket.sgp1.cdn.digitaloceanspaces.com/6c5f4212-3245-4ae3-8d44-bc732700305b..png
  return `https://${params.Bucket}.${process.env.CHATIFY_DEMO_BUCKET_URL!.slice(
    8
  )}/${params.Key}`;
}

export default {
  internalServerError,
  badRequest,
  successRequest,
  uploadImage,
  uploadImageFromBuffer,
};
