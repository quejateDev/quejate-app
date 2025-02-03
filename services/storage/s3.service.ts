import { S3Client, ListBucketsCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, AWS_BUCKET } from "@/lib/config";
import { Buffer } from "buffer";


const client = new S3Client({ 
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
})

export async function listBuckets() {
    const command = new ListBucketsCommand({});
    const response = await client.send(command);
    return response.Buckets;
}

export async function uploadObject(key: string, body: ArrayBuffer, bucket = AWS_BUCKET) {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(body)
    });

    await client.send(command);

    return { message: "Object uploaded" };
}

export async function getObjectPresignedUrl(key: string, bucket = AWS_BUCKET) {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key
    });

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });

    return url;
}

export async function deleteObject(key: string, bucket = AWS_BUCKET) {
    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key
    });

    await client.send(command);

    return { message: "Object deleted" };
}


