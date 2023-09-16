from services_sign_process.model.signet import SigNet
from services_sign_process.preprocess import preprocess_signature
import torch.nn.functional as F
import torch

canvas_size = (952, 1360)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using {device} device")

state_dict, _, _ = torch.load(
    "apps\\services\\sign-process\\services_sign_process\\model\\signet.pth",
    map_location=device,
)

base_model = SigNet().to(device).eval()
base_model.load_state_dict(state_dict)


def do_signet(ref, sign):
    preprocessed = torch.tensor(
        [
            preprocess_signature(ref, canvas_size),
            preprocess_signature(sign, canvas_size),
        ]
    )

    preprocessed = preprocessed.view(-1, 1, 150, 220).float().div(255)

    with torch.no_grad():
        output = base_model(preprocessed.to(device))

        ref_tensor_normalized = F.normalize(output[0], dim=0)
        sign_tensor_normalized = F.normalize(output[1], dim=0)

        # calculate cosine similarity
        cos = torch.nn.CosineSimilarity(dim=0, eps=1e-6)
        cos_sim = cos(ref_tensor_normalized, sign_tensor_normalized)

        return cos_sim.item()
