import { readFileSync } from 'fs';
import { join as pathJoin } from 'path';

export class AppEmailTemplates {
  public static ERR_REPORTER = readFileSync(
    pathJoin(__dirname, 'err-reporter.ejs'),
  ).toString();
}
