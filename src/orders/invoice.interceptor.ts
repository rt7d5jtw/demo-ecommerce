import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class InvoiceInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((buffer) => ({
        'Content-type': 'application/pdf',
        'Content-Disposition': 'attachment',
        'Content-Length': buffer.length,
        filename: 'invoice.pdf'
      }))
    );
  }
}
