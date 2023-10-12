import os
import cv2
from cv2.typing import MatLike
import numpy as np
from table2cell.hints import Border
from table2cell.constants import MAX_COLS, MAX_ROWS


def process_image(
    image_path: str,
    page: int,
    expected_signs: int,
    borders: Border,
) -> list[MatLike]:
    # remove file name from path
    image_dir = "/".join(image_path.split("/")[:-1])

    # create a new directory for processed images
    dest_dir = image_dir + f"/processed/{str(page)}/"
    os.makedirs(dest_dir, exist_ok=True)

    original_image = cv2.imread(image_path)
    warped_image = __warp_image(original_image, borders)
    gray_image = cv2.cvtColor(warped_image, cv2.COLOR_BGR2GRAY)

    contours = __find_contours(gray_image)
    # bounding_boxes = __calculate_bounding_boxes(contours)

    cells = __get_cells(contours, expected_signs)
    grid = __sort_boxes_in_2D(cells)

    # n = 0
    cells = []

    for row in grid:
        for cell in row:
            # continue if cell is empty
            if cell == 0:
                continue
            x, y, w, h = cell  # type: ignore
            cropped = __crop_image(warped_image, x, y, w, h)
            cropped = __enhance_image(cropped)
            cells.append(cropped)

    return cells


def save_image(image, path):
    cv2.imwrite(path, image)


def __warp_image(image: MatLike, borders: Border) -> MatLike:
    img_height, img_width = image.shape[:-1]

    top_left = [
        int(borders["topLeft"]["x"] * img_width),
        int(borders["topLeft"]["y"] * img_height),
    ]

    top_right = [
        int(borders["topRight"]["x"] * img_width),
        int(borders["topRight"]["y"] * img_height),
    ]

    bottom_left = [
        int(borders["bottomLeft"]["x"] * img_width),
        int(borders["bottomLeft"]["y"] * img_height),
    ]

    bottom_right = [
        int(borders["bottomRight"]["x"] * img_width),
        int(borders["bottomRight"]["y"] * img_height),
    ]

    matrix = cv2.getPerspectiveTransform(
        np.float32([top_left, top_right, bottom_left, bottom_right]),  # type: ignore
        np.float32([[0, 0], [img_width, 0], [0, img_height], [img_width, img_height]]),  # type: ignore
    )

    return cv2.warpPerspective(image, matrix, (img_width, img_height))


def __enhance_image(image: MatLike) -> MatLike:
    # enhance saturation
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    s = np.clip(s * 1.5, 0, 255).astype(np.uint8)  # type: ignore
    hsv = cv2.merge((h, s, v))

    return cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)


def __find_contours(gray_image: MatLike):
    # perform both global and otsu thresholding
    (_, binary_image) = cv2.threshold(
        gray_image, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU
    )

    # invert the image
    thresh_img = 255 - binary_image  # type: ignore

    # perform morphological operations
    kernel_length = np.array(gray_image).shape[1] // 80
    verticle_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, kernel_length))
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernel_length, 1))
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))

    # Morphological operation to detect vertical lines from an image
    img_temp1 = cv2.erode(thresh_img, verticle_kernel, iterations=3)
    verticle_lines_img = cv2.dilate(img_temp1, verticle_kernel, iterations=3)

    # Morphological operation to detect horizontal lines from an image
    img_temp2 = cv2.erode(thresh_img, horizontal_kernel, iterations=3)
    horizontal_lines_img = cv2.dilate(img_temp2, horizontal_kernel, iterations=3)

    # Weighting parameters, this will decide the quantity of an image to be added to make a new image.
    alpha = 0.5
    beta = 1.0 - alpha

    weighted_binary_image = cv2.addWeighted(
        verticle_lines_img, alpha, horizontal_lines_img, beta, 0.0
    )

    weighted_binary_image = cv2.erode(~weighted_binary_image, kernel, iterations=2)  # type: ignore

    (_, final_image) = cv2.threshold(
        weighted_binary_image, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU
    )

    contours, _ = cv2.findContours(final_image, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    x, y, w, h = cv2.boundingRect(contours[0])

    return contours


def __calculate_bounding_boxes(contours):
    bounding_boxes = [cv2.boundingRect(c) for c in contours]
    return bounding_boxes


def __sort_boxes_in_2D(bounding_boxes):
    grid = [[0 for x in range(MAX_COLS)] for y in range(MAX_ROWS)]

    sorted_by_x = sorted(bounding_boxes, key=lambda tup: tup[0])

    def fn(n):
        # get cells that should be in same column
        col = sorted_by_x[MAX_ROWS * n : MAX_ROWS * (n + 1)]

        # sort them by y
        sorted_by_y = sorted(col, key=lambda tup: tup[1])

        # add them to grid
        for i, c in enumerate(sorted_by_y):
            grid[i][n] = c

    for i in range(MAX_COLS):
        fn(i)

    return grid


def __get_cells(contours, expected_signs: int):
    area_list = []

    for c in contours:
        property_list = __get_area(c)
        area_list.append(property_list[4])

    indices = __get_closest_indices(area_list, expected_signs)

    contour_list = __get_bounding_contours(indices, contours)
    box_list = [cv2.boundingRect(c) for c in contour_list]
    return box_list


def __crop_image(image, x, y, w, h):
    return image[y : y + h, x : x + w]


def __get_bounding_contours(indices, contours):
    return [contours[i] for i in indices]


def __get_area(contours):
    x, y, w, h = cv2.boundingRect(contours)
    a = cv2.contourArea(contours)
    area = np.array(a).astype(int).tolist()
    return x, y, w, h, area


def __get_closest_indices(lst, cell_count):
    sorted_lst = sorted(enumerate(lst), key=lambda x: x[1])
    best_diff = float("inf")
    best_slice = []
    for i in range((len(sorted_lst)) - (cell_count - 1)):
        slice_diff = sorted_lst[i + (cell_count - 1)][1] - sorted_lst[i][1]
        if slice_diff < best_diff:
            best_diff = slice_diff
            best_slice = sorted_lst[i : i + cell_count]
    return sorted([x[0] for x in best_slice])


if __name__ == "__main__":
    process_image(
        "./assets/attendance_sheets/signs.jpg",
        0,
        63,
        {
            "topLeft": {"x": 0.0, "y": 0.0},
            "topRight": {"x": 1.0, "y": 0.0},
            "bottomLeft": {"x": 0.0, "y": 1.0},
            "bottomRight": {"x": 1.0, "y": 1.0},
        },
    )
