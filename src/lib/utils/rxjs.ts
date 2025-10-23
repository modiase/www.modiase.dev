import { onDestroy } from 'svelte';
import { Observable, Subscription, timer } from 'rxjs';
import { retryWhen, mergeMap, finalize, tap } from 'rxjs/operators';

export function createSubscriptionManager() {
  const subscriptions = new Subscription();

  onDestroy(() => {
    subscriptions.unsubscribe();
  });

  return (subscription: Subscription) => {
    subscriptions.add(subscription);
    return subscription;
  };
}

export function retryWithBackoff<T>(maxRetries = 3, initialDelay = 1000) {
  return retryWhen<T>((errors) =>
    errors.pipe(
      mergeMap((error, index) => {
        if (index >= maxRetries) {
          throw error;
        }
        const delay = initialDelay * Math.pow(2, index);
        return timer(delay);
      })
    )
  );
}

export function tapLoading<T>(setLoading: (loading: boolean) => void) {
  return (source$: Observable<T>) =>
    source$.pipe(
      tap(() => setLoading(true)),
      finalize(() => setLoading(false))
    );
}
