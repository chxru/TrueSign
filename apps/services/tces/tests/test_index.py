from services_tces import index


def test_index():
    assert index.hello() == "Hello services-tces"
