import { 
    Store, 
    createStore as reduxCreateStore, 
    compose, 
    applyMiddleware } from 'redux';
import logger, { createLogger } from 'redux-logger';
import * as reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import {
    WebPartContext
  } from '@microsoft/sp-webpart-base';

import { IMeetingBookService } from '../../../services';

import { rootReducer, IRootState } from '../reducer';
import meetingBookListViewRootSaga from '../sagas';

export function createStore(
    context: WebPartContext,
    history: History,
    meetingBookService: IMeetingBookService,
    initialState?: IRootState): Store<IRootState> {

    const loggerMiddleware = logger;
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [     
        routerMiddleware(history),
        sagaMiddleware,
        reduxImmutableStateInvariant.default(),
        loggerMiddleware,
    ];

    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = reduxCreateStore(
        connectRouter(history)(rootReducer),
        initialState, 
        composeEnhancers(
            applyMiddleware(...middlewares)
        )
    );

    sagaMiddleware.run(meetingBookListViewRootSaga, meetingBookService, context.pageContext.site.absoluteUrl);

    return store;

}