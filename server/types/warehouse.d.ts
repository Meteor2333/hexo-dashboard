/* eslint-disable semi */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'model' {
  import type { EventEmitter } from 'events';
  import type Document from 'document';
  import type Query from 'query';

  export default interface Model<T> extends EventEmitter {
    name: string;

    /**
     * Finds a document by its identifier.
     */
    findById(id: PropertyKey): Document<T>;

    /**
     * Finds the first matching documents.
     */
    findOne(query: object): Document<T>;

    /**
     * Creates an array of values by iterating each element in the collection.
     *
     * @param {Function} iterator
     * @param {Object} [options]
     * @return {Array}
     */
    map<R>(iterator: (value: Document<T>, index: number) => R): R[];

    /**
     * Creates a new array with all documents that pass the test implemented by the
     * provided function.
     */
    filter(iterator: (value: Document<T>, index: number) => boolean): Query<T>;
  }
}

declare module 'document' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export default interface Document<T> {
    [key: string]: any;
  }
}

declare module 'query' {
  import type Document from 'document';

  export default interface Query<T> {
    length: number;

    /**
     * Limits the number of documents returned.
     */
    limit(i: number): Query<T>;

     /**
     * Specifies the number of items to skip.
     */
    skip(i: number): Query<T>;

    /**
     * Sorts documents.
     *
     * Example:
     *
     * ``` js
     * query.sort('date', -1);
     * query.sort({date: -1, title: 1});
     * query.sort('-date title');
     * ```
     *
     * If the `order` equals to `-1` or `desc`, the data will be
     * returned in reversed order.
     */
    sort(orderby: string, order: 'desc' | number | Record<string, any>): Query<T>;

    /**
     * Creates an array of values by iterating each element in the collection.
     */
    map<R>(iterator: (item: Document<T>, index: number) => R): R[];

    /**
     * Tests whether some documents pass the test implemented by the provided
     * function.
     */
    some(iterator: (item: Document<T>, index: number) => boolean): boolean;
  }
}
