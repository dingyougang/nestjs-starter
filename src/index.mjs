import {
  Observable,
  throwError,
  timer,
  retry,
  catchError,
  defer,
  lastValueFrom,
} from 'rxjs';
// 1.timer 延迟执行
// const exampleTimer = timer(2000);
// exampleTimer.subscribe({
//   next: (val) => console.log('next', val),
//   complete: () => console.log('complete'),
// });

//2.retry 重试
// let count = 0;
// const errorObservable = new Observable((subscriber) => {
//   count++;
//   console.log('retry', count);
//   subscriber.error(new Error('error'));
// });
// const handleObservable = errorObservable.pipe(
//   retry(3),
//   catchError((err) => {
//     console.log('catchError', err);
//     return throwError(() => new Error('error after retry'));
//   }),
// );
// handleObservable.subscribe({
//   error: (err) => console.log('final error', err.message || err),
// });

// 3.defer 延迟创建observable
const deferObservable = defer(() => {
  console.log('Observable created');
  return new Observable((subscriber) => {
    subscriber.next('hello1');
    subscriber.next('hello2');
    // subscriber.next('hello3');
    // subscriber.complete();
    timer(2000).subscribe(() => {
      subscriber.next('hello3');
      subscriber.complete();
    });
  });
});

async function getDeferValue() {
  const result = await lastValueFrom(deferObservable);
  console.log('🚀 ~ getDeferValue ~ result:', result);
}
getDeferValue();
