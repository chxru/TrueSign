# check mc is installed
if ! command -v mc &> /dev/null
then
    echo "mc could not be found"
    exit 1
fi

echo "mc is installed"

mc alias set local http://minio:9000 minio minio123
mc event add local/upload arn:minio:sqs::PRIMARY:webhook --event put

echo "mc is configured"
exit 0
