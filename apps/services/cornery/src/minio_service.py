from minio import Minio
from minio.error import InvalidResponseError

minio_config = {
    "endpoint": "localhost:9000",
    "access_key": "minio",
    "secret_key": "minio123",
    "secure": False
}


class MinioService:
    __minio: Minio = None

    def __init__(self) -> None:
        self.__minio = Minio(**minio_config)

    def create_bucket(self, bucket_name: str) -> None:
        found = self.__minio.bucket_exists(bucket_name)

        if not found:
            try:
                self.__minio.make_bucket(bucket_name)
            except InvalidResponseError as err:
                print(err)

    def copy_object(self, object_key: str, save_dst: str) -> None:
        bucket_name = object_key.split("/")[0]
        object_name = object_key.split("/")[1]

        try:
            data = self.__minio.get_object(bucket_name=bucket_name, object_name=object_name)
            with open(save_dst, 'wb') as file_data:
                for d in data.stream(32 * 1024):
                    file_data.write(d)

            print(f"Downloaded image from minio to {save_dst}")
        except InvalidResponseError as err:
            print(err)