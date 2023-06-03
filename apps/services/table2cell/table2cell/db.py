import os
from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.collection import Collection
from table2cell.hints import Attendance, Modules

load_dotenv()


MONGO_USERNAME = os.getenv("MONGO_USERNAME")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")
MONGO_HOST = os.getenv("MONGO_HOST")

if not MONGO_USERNAME or not MONGO_PASSWORD or not MONGO_HOST:
    raise Exception("MongoDB credentials are missing")

mongo_url = f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}@{MONGO_HOST}/"
mongo = MongoClient(mongo_url)

db = mongo["test"]
attendance_collection: Collection[Attendance] = db["attendances"]
modules_collection: Collection[Modules] = db["modules"]


def get_attendance_data(attendance_id: str) -> Attendance:
    data = attendance_collection.find_one({"_id": ObjectId(attendance_id)})
    if not data:
        raise Exception("Attendance data not found")

    return data


def get_student_count(moduleId: ObjectId) -> int:
    query = modules_collection.aggregate(
        [
            {"$match": {"_id": moduleId}},
            {"$project": {"student_count": {"$size": "$students"}}},
        ]
    )

    module = list(query)[0]
    if not module:
        raise Exception("Module not found")

    return module["student_count"]
