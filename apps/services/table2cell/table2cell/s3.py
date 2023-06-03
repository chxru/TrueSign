import os

import boto3
from dotenv import load_dotenv

load_dotenv()

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name="ap-southeast-1",
)

BUCKET_NAME = os.getenv("S3_BUCKET")


def download_image(path: str):
    query = s3.get_object(Bucket=BUCKET_NAME, Key=path)

    # save image in /tmp
    file_name = path.split("/")[-1]
    session_id = path.split("/")[-2]
    file_path = f"/tmp/{session_id}/{file_name}"

    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    with open(file_path, "wb") as f:
        f.write(query["Body"].read())

    return file_path
