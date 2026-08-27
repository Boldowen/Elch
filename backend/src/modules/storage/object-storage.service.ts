import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';

export type StoredObject = {
  key: string;
  bytes: Uint8Array;
  contentType: string;
};

@Injectable()
export class ObjectStorageService {
  private readonly driver: 'local' | 's3';
  private readonly localRoot: string;
  private readonly bucket: string;
  private readonly s3?: S3Client;

  constructor(private readonly config: ConfigService) {
    this.driver = config.get<'local' | 's3'>('STORAGE_DRIVER', 'local');
    this.localRoot = resolve(config.get<string>('STORAGE_LOCAL_ROOT', '.data/uploads'));
    this.bucket = config.get<string>('S3_BUCKET', 'elch-private');
    if (this.driver === 's3') {
      const accessKeyId = config.get<string>('S3_ACCESS_KEY_ID', '');
      const secretAccessKey = config.get<string>('S3_SECRET_ACCESS_KEY', '');
      this.s3 = new S3Client({
        region: config.get<string>('S3_REGION', 'us-east-1'),
        endpoint: config.get<string>('S3_ENDPOINT') || undefined,
        forcePathStyle: config.get<boolean>('S3_FORCE_PATH_STYLE', false),
        credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
      });
    }
  }

  async put(key: string, bytes: Uint8Array, contentType: string) {
    this.assertKey(key);
    if (this.driver === 's3') {
      try {
        await this.s3!.send(new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: bytes,
          ContentType: contentType,
          ServerSideEncryption: this.config.get<'AES256' | 'aws:kms'>('S3_SERVER_SIDE_ENCRYPTION', 'AES256'),
        }));
      } catch {
        throw new ServiceUnavailableException({
          code: 'DOCUMENT_STORAGE_UNAVAILABLE',
          message: 'Document storage is temporarily unavailable',
        });
      }
      return;
    }

    const path = this.localPath(key);
    await mkdir(dirname(path), { recursive: true, mode: 0o700 });
    await writeFile(path, bytes, { flag: 'wx', mode: 0o600 });
  }

  async get(key: string, contentType: string): Promise<StoredObject> {
    this.assertKey(key);
    if (this.driver === 's3') {
      try {
        const object = await this.s3!.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
        if (!object.Body) throw new Error('Object body is empty');
        return {
          key,
          bytes: await object.Body.transformToByteArray(),
          contentType: object.ContentType || contentType,
        };
      } catch {
        throw new ServiceUnavailableException({
          code: 'DOCUMENT_STORAGE_UNAVAILABLE',
          message: 'Document storage is temporarily unavailable',
        });
      }
    }
    return { key, bytes: await readFile(this.localPath(key)), contentType };
  }

  async remove(key: string) {
    this.assertKey(key);
    if (this.driver === 's3') {
      await this.s3!.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
      return;
    }
    try {
      await unlink(this.localPath(key));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
  }

  maxFileBytes() {
    return this.config.get<number>('STORAGE_MAX_FILE_BYTES', 5_242_880);
  }

  private localPath(key: string) {
    const path = resolve(this.localRoot, key);
    const segment = relative(this.localRoot, path);
    if (!segment || segment.startsWith('..') || isAbsolute(segment)) throw new Error('Invalid object storage key');
    return path;
  }

  private assertKey(key: string) {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._/-]{1,300}$/.test(key) || key.includes('..') || key.includes('//')) {
      throw new Error('Invalid object storage key');
    }
  }
}
