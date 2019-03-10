import * as AWS from 'aws-sdk';
import { Promise } from 'bluebird';
import { join as pathJoin } from 'path';

AWS.config.loadFromPath(pathJoin(__dirname, '../config/credentials/aws.json'));
AWS.config.setPromisesDependency(Promise);

export default AWS;
