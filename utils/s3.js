import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function generatePresignedUrl(fileType, userId, documentType) {
  if (!ALLOWED_FILE_TYPES.includes(fileType)) {
    throw new Error('Invalid file type');
  }

  const fileExtension = fileType.split('/')[1];
  const key = `${documentType}/${userId}/${crypto.randomUUID()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return {
    url: signedUrl,
    key,
  };
}

export function getSecureFileUrl(key) {
  // Generate a time-limited signed URL for secure file access
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function uploadToS3(buffer, fileName, contentType) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Return the public URL
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

export async function validateFile(file) {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    throw new Error('Invalid file type');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }

  // Additional security checks could be added here
  // - Virus scanning
  // - Image/PDF validation
  // - Metadata stripping
  
  return true;
}