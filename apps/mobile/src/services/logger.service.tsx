export class Logger {
  readonly scope: string;

  /**
   * Custom logger class
   * @param scope function name, service name etc.
   */
  constructor(scope: string) {
    this.scope = scope;
  }

  /**
   * Log level messages
   * @param message string
   */
  log(message: string) {
    console.log(`${this.scope} : ${message}`);
  }
}
