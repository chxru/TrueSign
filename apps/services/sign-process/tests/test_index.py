from services_sign_process import index


def test_index():
    assert index.hello() == "Hello services-sign-process"
