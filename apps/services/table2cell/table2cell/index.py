import boto3
import json
import os
from dotenv import load_dotenv
from table2cell.cv import process_image
from table2cell.db import get_attendance_data, get_student_count
from table2cell.s3 import download_image

load_dotenv()

sqs = boto3.client(
    "sqs",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name="ap-southeast-1",
)


def process_key(key: str):
    arr = key.split("/")

    # key should contain 4 parts
    if len(arr) != 4:
        print(arr)
        raise Exception("Invalid key format")

    # first and second parts can be ignored
    attendance_id = arr[2]
    file_name = arr[3]
    page_no = int(file_name.split(".")[0])

    # get attendance data from database
    attendance_data = get_attendance_data(attendance_id)
    student_count = get_student_count(attendance_data["moduleId"])

    # download and save image
    image_path = download_image(key)

    # process image
    process_image(image_path, student_count, page_no)


def listen_queue():
    response = sqs.receive_message(
        QueueUrl=os.getenv("SQS_ATTENDANCE_QUEUE_NAME"),
        MaxNumberOfMessages=1,
    )

    for message in response["Messages"]:
        try:
            message = json.loads(message["Body"])["Message"]
            key = json.loads(message)["Records"][0]["s3"]["object"]["key"]

            print(key)

            process_key(key)
        except Exception as e:
            # exceptions can be occurred due to missing key or value in the message
            # log and ignore them for now
            print(e)


listen_queue()
