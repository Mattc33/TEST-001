import * as React from 'react';
import { connect, Provider, Store } from 'react-redux';
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import { ConnectedRouter } from 'connected-react-router';
import createHistory from 'history/createBrowserHistory';
import { Route, Switch } from 'react-router';
import { History } from 'history';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

import { 
  IUserService, 
  SPUserService, 
  IMeetingBookService, 
  MeetingBookService 
} from '../../services';


import { createStore } from './store';
import { IRootState, initialRootState } from './reducer';

import { MeetingBookListView } from './components/meeting-book-list-view/meeting-book-list-view';

require("./components/meeting-book-list-view/svpbigappleportal.css");

export interface IMeetingBookListViewProviderProps {
  context: WebPartContext;
}

export interface IMeetingBookListViewProviderState {
  initialized: boolean;
}


export class MeetingBookListViewProvider extends React.Component<IMeetingBookListViewProviderProps, IMeetingBookListViewProviderState> {

  private _store: Store<IRootState>;
  private _context: WebPartContext;
  private _history: History;
  private _meetingBookService: IMeetingBookService;
  private _userService: IUserService;

  constructor(props: IMeetingBookListViewProviderProps) {

    super(props);

    document.title = 'Meeting Books';

    // Component gets initialized 
    // once the redux store is created
    this.state = {
      initialized: false
    };

    this._context = props.context;
    this._history = createHistory();

    this._meetingBookService = new MeetingBookService({
      context: props.context,
      siteAbsoluteUrl: props.context.pageContext.site.absoluteUrl,
      spHttpClient: props.context.spHttpClient
    });

    this._userService = new SPUserService({
      context: props.context,
      siteAbsoluteUrl: props.context.pageContext.site.absoluteUrl,
      spHttpClient: props.context.spHttpClient
    });

  }

  public async componentDidMount() {

    await this.initStateFromHistory();

  }

  public render(): React.ReactElement<IMeetingBookListViewProviderProps> {

    const root = (this.state.initialized) ? 
      <Provider store={this._store}>
        <ConnectedRouter history={this._history}>
          <Switch>
            <Route 
              path="*" 
              render={props => 
                <MeetingBookListView 
                  userService={this._userService}
                  currentUserEmail={this.props.context.pageContext.user.email}
                  baseUrl={this.props.context.pageContext.site.absoluteUrl} /> 
              } />
          </Switch>
        </ConnectedRouter>
      </Provider> : <div>Loading...</div>;

    return (
      root
    );
  }


  @autobind
  private async initStateFromHistory() {

    // Initial empty state
    const initialState: IRootState = {
      ...initialRootState,
    };
    
    // Create the Redux store
    this._store = createStore(
      this._context,
      this._history, 
      this._meetingBookService,
      initialState);

    // Let React know to initialize the control
    this.setState({
      initialized: true
    });

  }

}