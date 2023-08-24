import time
import boto3
import json
import os
from dotenv import load_dotenv
from table2cell.process.attendance import process_attendance
from table2cell.process.refsheets import process_reference_sheets
from table2cell.s3 import download_image

load_dotenv()

sqs = boto3.client(
    "sqs",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name="ap-southeast-1",
)


def listen_queue():
    response = sqs.receive_message(
        QueueUrl=os.getenv("SQS_ATTENDANCE_QUEUE_NAME"),
        MaxNumberOfMessages=5,
    )

    if "Messages" not in response:
        return

    print("processing message")

    for message in response["Messages"]:
        decoded_message = json.loads(message["Body"])["Message"]

        try:
            message = json.loads(decoded_message)
            key: str = message["Records"][0]["s3"]["object"]["key"]
        except:
            print("invalid message format")
            continue

        print("processing file " + key)

        arr = key.split("/")
        image_type = arr[1]
        unique_id = arr[2]
        file_name = arr[3]

        if image_type == "reference_sign_sheets":
            image_path = download_image(key, "reference")
            process_reference_sheets(unique_id, file_name, image_path)
            return

        if image_type == "attendance":
            image_path = download_image(key, "attendance")
            process_attendance(unique_id, file_name, image_path)
            delete_from_queue(message["ReceiptHandle"])
            return

        print("Unrecognized image type", key)


def delete_from_queue(receipt_handle: str):
    return
    sqs.delete_message(
        QueueUrl=os.getenv("SQS_ATTENDANCE_QUEUE_NAME"),
        ReceiptHandle=receipt_handle,
    )


if __name__ == "__main__":
    print("listening to queue")

    while True:
        listen_queue()

        # sleep 30sec
        time.sleep(30)
