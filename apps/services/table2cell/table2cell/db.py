import os
from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.collection import Collection
from table2cell.hints import Attendance, Modules, RefSigs

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
students_collection: Collection[dict] = db["students"]
refsigs_collection: Collection[RefSigs] = db["refsigs"]


def get_attendance_data(attendance_id: str) -> Attendance:
    data = attendance_collection.find_one({"_id": ObjectId(attendance_id)})
    if not data:
        raise Exception("Attendance data not found")

    return data


def get_refsig_data(unique_id: str, file_name: str) -> RefSigs:
    data = refsigs_collection.find_one({"uniqueId": unique_id, "fileName": file_name})
    if not data:
        raise Exception("RefSig data not found")

    return data


def get_students_id_list(moduleId: ObjectId) -> list[str]:
    query = modules_collection.aggregate(
        [
            {"$match": {"_id": moduleId}},
            {
                "$lookup": {
                    "from": "students",
                    "localField": "students",
                    "foreignField": "_id",
                    "as": "students",
                }
            },
            {"$project": {"student_id_list": "$students.studentId"}},
        ]
    )

    students = list(query)[0]
    if not students:
        raise Exception("Students not found")

    students = students["student_id_list"]

    return __sort_student_ids(students)


def get_ref_sheet_students(unqiue_id: str) -> list[str]:
    data = students_collection.find({"importedIn": unqiue_id}, {"studentId": 1})
    if not data:
        raise Exception("Students not found")

    students = [student["studentId"] for student in data]
    return __sort_student_ids(students)


def __sort_student_ids(student_ids: list[str]) -> list[str]:
    def key_fn(student_id: str):
        # split id into components
        faculty, year, pid = student_id.split("/")
        return (faculty, int(year), int(pid))

    return sorted(student_ids, key=key_fn)
