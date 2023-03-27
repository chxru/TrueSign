import cv2
import numpy as np
import json
from minio_service import MinioService

minio = MinioService()


def __get_contour(original):
    """Get the corners of the image. Returns coordinates of corners."""
    rescale_height = 500
    ratio = original.shape[0] / rescale_height
    img = cv2.resize(
        original, (int(original.shape[1] / ratio), rescale_height))

    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.GaussianBlur(img, (5, 5), 1)
    img = cv2.Canny(img, 50, 50)

    kernel = np.ones((5, 5))

    img = cv2.dilate(img, kernel, iterations=1)
    img = cv2.erode(img, kernel, iterations=1)

    contours, _ = cv2.findContours(img, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]

    corners = False
    for c in contours:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        if (len(approx) == 4):
            corners = approx
            break

    if (corners is False):
        # set image corners as corners
        corners = np.array([[0, 0], [original.shape[1], 0], [
                           original.shape[1], original.shape[0]], [0, original.shape[0]]])

        return corners

    corners = corners.squeeze()

    # order the corners top-left, top-right, bottom-right, bottom-left
    x_sorted = corners[corners[:, 0].argsort()]
    left_most = x_sorted[:2]
    top_left = left_most[left_most[:, 1].argsort()][0]
    bottom_left = left_most[left_most[:, 1].argsort()][1]

    right_most = x_sorted[2:]
    top_right = right_most[right_most[:, 1].argsort()][0]
    bottom_right = right_most[right_most[:, 1].argsort()][1]

    corners = np.array([top_left, top_right, bottom_right, bottom_left])

    # rescale corners to original image size
    corners = corners * ratio

    # convert to int
    corners = corners.astype(int)
    return corners


def detect_corners(message: str):
    obj = json.loads(message)

    # download image from minio
    file_name = obj['Key'].split("/")[-1]
    saved_file = f"/tmp/{file_name}"
    minio.copy_object(obj['Key'], saved_file)

    image = cv2.imread(saved_file)
    corners = __get_contour(image)

    print(corners.squeeze())
