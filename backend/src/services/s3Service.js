const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// This check happens when the server starts. It will crash immediately if your .env is wrong.
if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("FATAL ERROR: Missing required AWS credentials in .env file. Please check AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY.");
}

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const getVideoUrl = async (key) => {
    if (!process.env.S3_BUCKET_NAME) {
        console.error("S3_BUCKET_NAME is not defined in .env file.");
        throw new Error("Server is missing S3_BUCKET_NAME configuration.");
    }
    
    console.log(`Attempting to get signed URL for key: "${key}" in bucket: "${process.env.S3_BUCKET_NAME}"`);

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        console.log(`Successfully generated signed URL for ${key}`);
        return url;
    } catch (error) {
        console.error("--- AWS S3 ERROR ---");
        console.error("Failed to generate signed URL. This is likely an IAM policy, credentials, or filename issue.");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        console.error("Please check that your IAM user has s3:GetObject permission and that the file key exists in the bucket.");
        console.error("--- END AWS S3 ERROR ---");
        throw error;
    }
};

module.exports = { getVideoUrl };