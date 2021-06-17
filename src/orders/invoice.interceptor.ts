import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class InvoiceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
    .pipe(
      map(data => ({
        'Content-type': 'application/pdf',
        'Content-Disposition': 'attachment',
        filename: 'order.pdf',
        'Content-Length': data.length,
      }))
    )
  }
}
