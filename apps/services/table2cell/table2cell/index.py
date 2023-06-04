import boto3
import json
import os
from dotenv import load_dotenv
from table2cell.constants import MAX_COLS, MAX_ROWS
from table2cell.cv import process_image
from table2cell.db import get_attendance_data, get_students_id_list
from table2cell.s3 import download_image, upload_img

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
    students = get_students_id_list(attendance_data["moduleId"])
    student_count = len(students)

    max_signs_per_page = MAX_COLS * MAX_ROWS
    start_sign_idx = (page_no) * max_signs_per_page
    end_sign_idx = (page_no + 1) * max_signs_per_page

    # if end_sign_idx exceeds student_count, set it to student_count
    if end_sign_idx > student_count:
        end_sign_idx = student_count

    # get students for this page
    students = students[start_sign_idx:end_sign_idx]

    # download and save image
    image_path = download_image(key)

    # process image
    signs_dir = process_image(
        image_path,
        page_no,
        end_sign_idx - start_sign_idx,
        attendance_data["originalImages"][file_name.replace(".", "_")]["borders"],
        students,
    )

    # upload image to s3
    for file_name in os.listdir(signs_dir):
        file_path = signs_dir + file_name
        upload_img(file_path, attendance_id)


def listen_queue():
    response = sqs.receive_message(
        QueueUrl=os.getenv("SQS_ATTENDANCE_QUEUE_NAME"),
        MaxNumberOfMessages=1,
    )

    if "Messages" not in response:
        print("No messages in queue")
        return

    for message in response["Messages"]:
        message = json.loads(message["Body"])["Message"]
        key = json.loads(message)["Records"][0]["s3"]["object"]["key"]

        print(key)

        process_key(key)


listen_queue()
