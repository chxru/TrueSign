import json
import numpy as np
import cv2
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
# from warp import warpImage

app = Flask(__name__)
CORS(app)

def identify_corners(coords):
    # Sort coordinates by x-value
    sorted_coords = sorted(coords, key=lambda coord: coord[0])

    # Identify left and right coordinates
    left_coords = sorted_coords[:2]
    right_coords = sorted_coords[2:]

    # Sort left and right coordinates by y-value
    top_left, bottom_left = sorted(left_coords, key=lambda coord: coord[1])
    top_right, bottom_right = sorted(right_coords, key=lambda coord: coord[1])

    return top_left, top_right, bottom_left, bottom_right

def warpImage(name, borders, resolution):
    try:
        topLeft = borders['topLeft']
        topRight = borders['topRight']
        bottomLeft = borders['bottomLeft']
        bottomRight = borders['bottomRight']

        width = int(resolution.split('x')[0])
        height = int(resolution.split('x')[1])

        # read image
        img = cv2.imread('./outputs/' + name)

        # image dimensions
        imgHeight, imgWidth, _ = img.shape

        # scale the points to the resolution of the image
        topLeft = (topLeft['x'] * imgWidth / width, topLeft['y'] * imgHeight / height)
        topRight = (topRight['x'] * imgWidth / width, topRight['y'] * imgHeight / height)
        bottomLeft = (bottomLeft['x'] * imgWidth / width, bottomLeft['y'] * imgHeight / height)
        bottomRight = (bottomRight['x'] * imgWidth / width, bottomRight['y'] * imgHeight / height)

        tl, tr, bl, br = identify_corners([topLeft, topRight, bottomLeft, bottomRight])

    #    warp tranform
        pts1 = np.float32([tl, tr, bl, br]).reshape(4, 2) # type: ignore
        pts2 = np.float32([[0, 0], [int(imgWidth), 0], [0, int(imgHeight)], [int(imgWidth), int(imgHeight)]]) # type: ignore
        matrix = cv2.getPerspectiveTransform(pts1, pts2) # type: ignore
        result = cv2.warpPerspective(img, matrix, (int(imgWidth), int(imgHeight)))

        # save image
        cv2.imwrite('./outputs/processed/' + name, result)
    except Exception as e:
        print(e)

@app.post('/upload')
def upload():
    print("upload")
    try:
        borders = request.form['borders']
        borders = json.loads(borders)

        resolution = request.form['resolution']

        file = request.files['image']
        if (file.filename is None):
            return jsonify({'message': 'no file name sent'}), 400

        file.save('./outputs/' + secure_filename(file.filename))

        warpImage(file.filename, borders, resolution)

        return jsonify({'message': 'success'}), 200
    except Exception as e:
        return str(e), 500


if __name__ == '__main__':
    app.run()
