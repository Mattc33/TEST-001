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

// export const withErrHandler = (promise: Promise<any>): Promise<any[]> => {
//     return new Promise<any[]>((resolve, reject) => {
//         try
//         {
//             promise
//                 .then((data) => resolve([ data, null ]))
//                 .catch((err) => resolve([ null, err ]))
//         }
//         catch(err) {
//             resolve([ null, err ]);
//         }
//     });
// };


export const withErrHandler = <T extends {}>(promise: Promise<any>): Promise<[T, any]> => {
    return new Promise<[T, any]>((resolve, reject) => {
        try
        {
            promise
                .then((data) => resolve([ data as T, null as any ]))
                .catch((err) => resolve([ null as T, err as any ]));
        }
        catch(err) {
            resolve([ null as T, err as any]);
        }
    });
};