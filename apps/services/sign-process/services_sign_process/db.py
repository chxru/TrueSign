import os
from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.collection import Collection
from services_sign_process.hints import AttendanceMarking


load_dotenv()


MONGO_USERNAME = os.getenv("MONGO_USERNAME")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")
MONGO_HOST = os.getenv("MONGO_HOST")
MONGO_DB = os.getenv("MONGO_DB") or "test"

THRESHOLD = 0.77
TOLERANCE = 0.02

if not MONGO_USERNAME or not MONGO_PASSWORD or not MONGO_HOST:
    raise Exception("MongoDB credentials are missing")

mongo_url = f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}@{MONGO_HOST}/"
mongo = MongoClient(mongo_url)

db = mongo[MONGO_DB]
attendance_marking_collection: Collection[AttendanceMarking] = db["attendance_marking"]
students_collection: Collection[dict] = db["students"]


def mark_attendance(
    attendance_id: str, student_id: str, is_absent: bool, sign_authenticity: float = 0
):
    # find student's _id from registration number
    formatted_student_id = student_id.replace("_", "/")
    student = students_collection.find_one({"studentId": formatted_student_id})
    if not student:
        raise Exception(f"Student {student_id} not found")

    attendance_db_id = ObjectId(attendance_id)

    # calculate sign state
    """
    threshold + tolerance > value => genuine
    threshold - tolerance < value < threshold + tolerance => pending
    threshold - tolerance < value => forged
    """
    sign_state = "absent"
    if not is_absent:
        if (THRESHOLD + TOLERANCE) < sign_authenticity:
            sign_state = "genuine"
        elif (THRESHOLD - TOLERANCE) < sign_authenticity < (THRESHOLD + TOLERANCE):
            sign_state = "pending"
        else:
            sign_state = "forged"

    # mark attendance
    doc = attendance_marking_collection.insert_one(
        {
            "attendance_id": attendance_db_id,
            "student_id": student["_id"],
            "is_absent": is_absent,
            "sign_authenticity": sign_authenticity,
            "sign_state": sign_state,
        }  # type: ignore
    )

    return doc.inserted_id
