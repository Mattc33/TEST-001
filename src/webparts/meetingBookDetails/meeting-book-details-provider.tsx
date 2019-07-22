import * as React from 'react';
import { connect, Provider, Store } from 'react-redux';
import {
  WebPartContext
} from '@microsoft/sp-webpart-base';
import { ConnectedRouter } from 'connected-react-router';
import createHistory from 'history/createBrowserHistory';
import { Route, Switch } from 'react-router';
import * as queryString from 'query-string';
import { History } from 'history';
import * as _ from 'lodash';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

import { 
  IUserService, 
  SPUserService, 
  IMeetingBookService, 
  MeetingBookService 
} from '../../services';

import { MeetingBookType, EVENT_FORM_TYPE, CALENDAR_SERVICE, ISiteOptions } from '../../models';

import { createStore } from './store';
import { IRootState, initialRootState } from './reducer';

import MeetingBook from './components/meeting-book/meeting-book';
import MeetingBookManager from './components/meeting-book-manager/meeting-book-manager';

export interface IMeetingBookDetailsProviderProps {

  calendarFormView: EVENT_FORM_TYPE;
  calendarDataServiceName: CALENDAR_SERVICE;

  context: WebPartContext;
  artistTermSetName: string;
  artistTermSetId: string;

  categoryTermSetName: string;
  categoryTermSetId: string;

  hubUrl: string;

  siteOptions: ISiteOptions;

}

export interface IMeetingBookDetailsProviderState {

  initialized: boolean;
  meetingBookId: number;
  view: MeetingBookType;

}


export class MeetingBookDetailsProvider extends React.Component<IMeetingBookDetailsProviderProps, IMeetingBookDetailsProviderState> {

  private _store: Store<IRootState>;
  private _context: WebPartContext;
  private _history: History;
  private _meetingBookService: IMeetingBookService;
  private _userService: IUserService;

  constructor(props: IMeetingBookDetailsProviderProps) {

    super(props);

    document.title = 'Meeting Book';

    // Component gets initialized 
    // once the redux store is created
    this.state = {
      initialized: false,
      meetingBookId: 0,
      view: 'meeting'
    };

    this._context = props.context;
    this._history = createHistory();

    this._meetingBookService = new MeetingBookService(
      {
        context: props.context,
        siteAbsoluteUrl: props.context.pageContext.site.absoluteUrl,
        spHttpClient: props.context.spHttpClient
      }
    );

    this._userService = new SPUserService({
      context: props.context,
      siteAbsoluteUrl: props.context.pageContext.site.absoluteUrl,
      spHttpClient: props.context.spHttpClient
    });

  }

  public async componentDidMount() {

    // Need to get the initial values 
    // from the route
    // and initalize the redux store accordingly.
    await this.initStateFromHistory();

  }

  public render(): React.ReactElement<IMeetingBookDetailsProviderProps> {

    if(!this.state.initialized)
      return (<div>Loading...</div>);

    const view = this.state.view === 'compile' ?
      <MeetingBookManager 
        hubUrl={this.props.hubUrl}
        baseUrl={this._context.pageContext.site.absoluteUrl}
        meetingBookId={this.state.meetingBookId}
        userService={this._userService} 
        onViewChange={this.onViewChange} /> :
      <MeetingBook 
        siteOptions={this.props.siteOptions}
        calendarFormView={this.props.calendarFormView}
        calendarDataServiceName={this.props.calendarDataServiceName}
        hubUrl={this.props.hubUrl}
        meetingBookId={this.state.meetingBookId}
        context={this.props.context}
        onViewChange={this.onViewChange}
        artistTermSetName={this.props.artistTermSetName}
        artistTermSetId={this.props.artistTermSetId}
        categoryTermSetName={this.props.categoryTermSetName}
        categoryTermSetId={this.props.categoryTermSetId} />;

    const root = (this.state.initialized) ? 
      <Provider store={this._store}>
        <ConnectedRouter history={this._history}>
          <Switch>
            <Route path="*" render={props => 
              view
            } />
          </Switch>
        </ConnectedRouter>
      </Provider> : <div>Loading...</div>;

    return (
      root
    );
  }

  @autobind
  private onViewChange(view: MeetingBookType) {
    this.setState({
      view
    });
  }

  @autobind
  private async initStateFromHistory() {

    let qs = queryString.parse(this._history.location.search) || {};
    let meetingBookId = 0;

    let view: 'meeting' | 'compile' = 'meeting';

    try {

      meetingBookId = 
        JSON
          .parse(qs.vp_mbid || 0);

      view = qs.vp_view || 'meeting';

    } catch( err ) {
      // if error, just load an empty store and remvoe 
      // the bad query string
      qs = _.omit(
          qs, 
          'vp_mbid', 
          'vp_view');


      this._history.push(
        this._history.location.pathname + "?"
          + queryString.stringify(qs)
      );

    }

    // Initial empty state
    const initialState: IRootState = {
      ...initialRootState,
    };
    
    // Create the Redux store
    this._store = createStore(
       this._history, 
       this._context,
       this.props.hubUrl,
       this._meetingBookService,
       initialState);

    // Let React know to initialize the control
    //setTimeout(
    this.setState({
      initialized: true,
      meetingBookId: meetingBookId,
      view: view
    }); //, 1);

  }

}