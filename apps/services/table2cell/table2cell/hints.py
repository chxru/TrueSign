from typing import TypedDict

from bson import ObjectId


class Coordiantes(TypedDict):
    x: int
    y: int


class Border(TypedDict):
    topLeft: Coordiantes
    topRight: Coordiantes
    bottomLeft: Coordiantes
    bottomRight: Coordiantes


class OriginalImage(TypedDict):
    page: int
    path: str
    borders: Border


class Attendance(TypedDict):
    _id: ObjectId
    moduleId: ObjectId
    originalImages: dict[str, OriginalImage]


class Modules(TypedDict):
    _id: ObjectId
    students: list[ObjectId]
    """List of student ids"""
    student_count: int
