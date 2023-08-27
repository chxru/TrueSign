import cv2
import numpy as np
from services_sign_process.db import mark_attendance

BLACK_THRESHOLD = 0.01


def markAbsent(file_path: str, attendance_id: str, registration_no: str):
    if not __isAbsent(file_path):
        print("not absent")
        return

    doc = mark_attendance(attendance_id, registration_no, True)


def __isAbsent(file_path: str) -> bool:
    img = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (50, 50))

    # remove 15px from each side but keeping the same center
    img = img[15:35, 15:35]

    img = cv2.fastNlMeansDenoising(img, None, 10, 7, 21)  # type: ignore
    img = cv2.adaptiveThreshold(
        img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    # calculate black pixel percentage
    black = np.count_nonzero(img == 0)
    white = np.count_nonzero(img == 255)
    total = black + white
    black_percentage = black / total

    return black_percentage < BLACK_THRESHOLD
