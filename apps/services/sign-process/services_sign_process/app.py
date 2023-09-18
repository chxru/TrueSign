from services_sign_process.absent import markAbsent
from services_sign_process.dl import do_signet
from services_sign_process.preprocess import normalize_image
from skimage.io import imread
from skimage import img_as_ubyte  # type: ignore
from skimage.transform import resize
from table2cell.s3 import download_directory


def __load_image(path: str):
    """Load image from path"""
    return img_as_ubyte(imread(path, as_gray=True))


def handle_signature(attendance_id: str, registration_no: str, signature_path: str):
    """Handle the signature process"""
    # sign = cv2.imread(signature_path, cv2.IMREAD_GRAYSCALE)
    sign = __load_image(signature_path)

    # TODO: unncessarry cv2 imread inside
    isAbsent = markAbsent(signature_path, attendance_id, registration_no)

    if isAbsent:
        print(f"{attendance_id} marked as absent")
        return

    # download reference signatures
    refsigs = download_directory(
        f"refsigs/{registration_no}", f"ref_sign/{registration_no}"
    )

    authenticities = []

    for refsign in refsigs:
        # ref = cv2.imread(refsign, cv2.IMREAD_GRAYSCALE)
        ref = __load_image(refsign)

        # first compare refsign and given signature, identify which image is smaller, and resize the other to match
        if ref.shape[0] > sign.shape[0]:
            # ref = cv2.resize(ref, (sign.shape[1], sign.shape[0]))
            ref = resize(ref, (sign.shape[0], sign.shape[1]))

        else:
            # sign = cv2.resize(sign, (ref.shape[1], ref.shape[0]))
            sign = resize(sign, (ref.shape[0], ref.shape[1]))

        authneticity = do_signet(ref, sign)
        authenticities.append(authneticity)

    # print average of authenticities
    avg = sum(authenticities) / len(authenticities)
    print(f"Average: {avg}")
