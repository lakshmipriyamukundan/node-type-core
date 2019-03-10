import { readFileSync } from 'fs';
import { join as pathJoin } from 'path';

export class Signature {
  public signature: string;
  public name: string;
  public email: string;

  constructor(signatureFileName: string, name: string, email: string) {
    this.signature = this.getSignature(signatureFileName);
    this.name = name;
    this.email = email;
  }

  private getSignature(fileName: string): string {
    return readFileSync(pathJoin(__dirname, fileName)).toString();
  }
}
