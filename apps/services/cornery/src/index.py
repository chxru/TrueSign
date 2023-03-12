from kafka_service import KafkaService
from app import detect_corners

if __name__ == "__main__":
    print("Cornery service started")

    try:
        kafka = KafkaService("minio", detect_corners)
        kafka.consume()
    finally:
        kafka.close()
