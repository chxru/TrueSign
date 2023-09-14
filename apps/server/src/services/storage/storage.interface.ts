export interface IStorageService {
  /**
   * Upload object to storage, returns the path of the object
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
    /**
     * The file name
     * @default uuidv4 + extension
     */
    filename?: string;
  }): Promise<string>;
}
