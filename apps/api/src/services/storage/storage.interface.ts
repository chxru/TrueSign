export interface IStorageService {
  /**
   * Upload object to storage
   * @param props
   */
  upload(props: {
    /**
     * Object data
     */
    data: Buffer;
    /**
     * The directory to upload the file to
     */
    directory: string;
    /**
     * The file extension
     */
    extension: string;
  }): Promise<void>;
}
