import { 
    Store, 
    createStore as reduxCreateStore, 
    compose, 
    applyMiddleware } from 'redux';
import logger, { createLogger } from 'redux-logger';
import * as reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import { History } from 'history';
import {
    WebPartContext
  } from '@microsoft/sp-webpart-base';

import { IMeetingBookService } from '../../../services';

import { rootReducer, IRootState } from '../reducer';
import meetingBookRootSaga from '../sagas';

export function createStore(
    history: History,
    wpContext: WebPartContext,
    hubUrl: string,
    meetingBookService: IMeetingBookService,
    initialState?: IRootState): Store<IRootState> {

    const loggerMiddleware = logger;
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [     
        routerMiddleware(history),
        sagaMiddleware,
        thunk,
        reduxImmutableStateInvariant.default(),
        loggerMiddleware
    ];

    // JA: to enable Redux Chrome DevTools
    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = reduxCreateStore(
        connectRouter(history)(rootReducer),
        initialState, 
        composeEnhancers(
            applyMiddleware(...middlewares)
        )
    );

    sagaMiddleware.run(
        meetingBookRootSaga,
        meetingBookService, 
        wpContext.pageContext.site.absoluteUrl, 
        wpContext.pageContext.site.serverRelativeUrl,
        hubUrl);

    return store;

}