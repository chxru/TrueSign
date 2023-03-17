from flask import Flask, request, json
from werkzeug.utils import secure_filename
from sign import extract_table

app = Flask(__name__)

@app.post('/upload')
def upload():
    try:
        file = request.files['image']
        file.save('outputs/' + secure_filename(file.filename))
        corners = extract_table('outputs/' + secure_filename(file.filename))
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
    except Exception as e:
        print(e)
        return str(e), 500

if __name__ == '__main__':
    app.run()
