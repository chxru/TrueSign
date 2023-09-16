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


def download_image(path: str, dest: str):
    print("downloading", path)

    query = s3.get_object(Bucket=BUCKET_NAME, Key=path)

    # save image in /tmp
    file_name = path.split("/")[-1]
    session_id = path.split("/")[-2]
    file_path = f"/tmp/{dest}/{session_id}/{file_name}"

    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    with open(file_path, "wb") as f:
        f.write(query["Body"].read())

    return file_path


def download_directory(path: str, dest: str):
    print("downloading", path)

    query = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=path)

    # throw error if no objects found
    if "KeyCount" not in query or query["KeyCount"] == 0:
        raise Exception("No objects found")

    files = []

    # save image in
    for obj in query["Contents"]:
        file_name = obj["Key"].split("/")[-1]
        file_path = f"/tmp/{dest}/{file_name}"

        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, "wb") as f:
            f.write(s3.get_object(Bucket=BUCKET_NAME, Key=obj["Key"])["Body"].read())

        files.append(file_path)

    return files


def upload_img(src: str, dest: str):
    """
    Upload image to s3
    """
    print("uploading", src, dest)

    s3.upload_file(src, BUCKET_NAME, dest)
