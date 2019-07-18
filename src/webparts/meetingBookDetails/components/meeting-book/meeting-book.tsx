import * as React from 'react';
import styles from './meetingbook.module.scss';
import { connect, Dispatch } from 'react-redux';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import {
    Spinner,
    SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';
import {
    WebPartContext
  } from '@microsoft/sp-webpart-base';

import { IRootState } from '../../reducer';

import {
    PreviewPanelCtrl,
    MeetingBookHeadingCtrl,
    ContentsCarouselCtrl
} from './controls';

import {
    IMeetingBookItem,
    IMeetingBook,
    MeetingBookType,
    EVENT_FORM_TYPE,
    CALENDAR_SERVICE,
    ISiteOptions
} from '../../../../models';

import MeetingBookViewActionCreator from './MeetingBookActionCreator';

require("./svpbigappleportal.css");

export interface IMeetingBookState {

    loading?: boolean;
    initialized?: boolean;
    error?: Array<any>;

    meetingBook?: IMeetingBook;
    items?: Array<IMeetingBookItem>;
    selectedItem?: IMeetingBookItem;

    contentHeight?: number;

}

export const initialMeetingBookState: IMeetingBookState = {

    loading: false,
    error: null,
    items: [],
    meetingBook: null,
    selectedItem: null,
    initialized: false,
    contentHeight: 0

};

export interface IMeetingBookProps extends IMeetingBookState {

    dispatch?: Dispatch<IRootState>;

    hubUrl: string;

    meetingBookId: number;
    context: WebPartContext;

    artistTermSetName: string;
    artistTermSetId: string;

    categoryTermSetName: string;
    categoryTermSetId: string;

    calendarFormView: EVENT_FORM_TYPE;
    calendarDataServiceName: CALENDAR_SERVICE;

    siteOptions: ISiteOptions;

    onViewChange: (view: MeetingBookType) => void;

}

class MeetingBookComponent extends React.Component<IMeetingBookProps, IMeetingBookState> {

    private actions: MeetingBookViewActionCreator;

    constructor(props: IMeetingBookProps) {
        super(props);

        this.actions = new MeetingBookViewActionCreator(this.props.dispatch);
        this.state = {
          contentHeight: 0
        };

    }

    public componentDidMount() {
        this.actions.initializeMeetingBook(this.props.meetingBookId);
    }

    public componentDidUpdate() {
    }

    public componentWillReceiveProps(newProps: IMeetingBookProps) {

        if(newProps.meetingBookId < 1)
            return;

        if(newProps.meetingBookId === this.props.meetingBookId)
            return;

        this.actions.initializeMeetingBook(newProps.meetingBookId);

    }

    public render(): React.ReactElement<IMeetingBookProps> {

        const emptyBook = !(!!this.props.items && !!this.props.items.length);

        return (
            <div className={ styles.meetingBook }>
            <div className="meeting-book-thumbs row--padding-top container-fluid">

                { !this.props.initialized &&

                    <Spinner size={SpinnerSize.large} />

                }

                { !!this.props.initialized && !!this.props.error &&

                    <div>

                        {this.props.error.map(e => {
                            return (<h4>{e}</h4>);
                        })}

                    </div>

                }

                {   !!this.props.initialized &&
                    !!this.props.meetingBook &&
                    !this.props.error &&

                    <div className={styles.row}>

                        <MeetingBookHeadingCtrl
                            meetingBook={this.props.meetingBook}
                            onEditView={this.onEditClick}
                            currentUser={this.props.context.pageContext.user} />

                        { !emptyBook &&

                            <ContentsCarouselCtrl
                                items={this.props.items}
                                onItemSelected={this.selectItem}
                                selectedItem={this.props.selectedItem} />

                        }
                        
                        <div className={styles.row}>

                            { !!this.props.initialized && !emptyBook && 

                               <PreviewPanelCtrl
                                    siteOptions={this.props.siteOptions}
                                    calendarFormView={this.props.calendarFormView}
                                    calendarDataServiceName={this.props.calendarDataServiceName}
                                    artistTermSetName={this.props.artistTermSetName}
                                    artistTermSetId={this.props.artistTermSetId}
                                    categoryTermSetName={this.props.categoryTermSetName}
                                    categoryTermSetId={this.props.categoryTermSetId}
                                    selectedItem={this.props.selectedItem}
                                    context={this.props.context} />

                            }

                            { !!this.props.initialized && !!emptyBook &&

                                <span className="meeting-book__empty-message">
                                    Meeting book is empty.  Click &nbsp;
                                    <button 
                                        type="button" 
                                        className="general__button general__button--small general__button--brand-primary"
                                        onClick={this.onEditClick}>Edit</button> 
                                    &nbsp; to add items.
                                </span>

                            }   
                        </div>
                    </div>
                }
            </div>
            </div>
        );

    }

    @autobind
    private calculateHeight() {

        let contentHeight = 400;

        if (this.props.initialized) {

            const bodyHeight = document.body.offsetHeight;

            try 
            {
                const msBar = document.querySelector('#suiteBarDelta')!.scrollHeight;
                const nav = document.querySelector('#headerBox')!.scrollHeight;
                const banner = document.querySelector('.wmg-site-header')!.scrollHeight;

                const headerHeight = msBar + nav + banner;
                contentHeight = bodyHeight - headerHeight;
            } catch (err) {

            }

        }

        return contentHeight;

    }

    @autobind
    private selectItem(item: IMeetingBookItem) {
        this.actions.selectItem(item);
    }

    @autobind
    private onEditClick() {
        this.props.onViewChange('compile');
    }


}

const mapStateToProps = (state: IRootState, ownProps: IMeetingBookProps): IMeetingBookProps => {

    return {
        ...state.meetingBookState,
        ...ownProps
    };

};

export default connect(mapStateToProps)(MeetingBookComponent);
