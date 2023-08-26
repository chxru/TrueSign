import json
import os
import time
import boto3
from dotenv import load_dotenv


load_dotenv()

sqs = boto3.client(
    "sqs",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name="ap-southeast-1",
)


def listen_queue():
    response = sqs.receive_message(
        QueueUrl=os.getenv("SQS_EXTRACTED_QUEUE_NAME"),
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
        attendance_id = arr[1]
        registration_no = arr[2]

        print(attendance_id, registration_no)


if __name__ == "__main__":
    print("listening to queue")

    while True:
        listen_queue()

        # sleep 30sec
        time.sleep(30)
