from typing import TypedDict
from bson import ObjectId


class AttendanceMarking(TypedDict):
    _id: ObjectId
    attendance_id: ObjectId
    student_id: ObjectId
    is_absent: bool
    sign_authenticity: float
    sign_state: str
