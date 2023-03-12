FROM minio/mc

COPY ./minio/mc.sh ./mc.sh
RUN chmod +x ./mc.sh && ./mc.sh
