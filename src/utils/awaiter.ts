// export interface IReturn<T> {
//     err?: Error;
//     data?: T;
// }

// const awaiter = (promise: Promise<T>): Promise<IReturn<T>> => {
//     return promise
//         .then((data: T) => { return { data } as IReturn<any>; } )
//         .catch((err: Error) => { return { err } as IReturn<any>;
//     });
// };