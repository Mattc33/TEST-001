import * as React from 'react';

import { autobind } from 'office-ui-fabric-react/lib/Utilities';

import {
    IMeetingBookItem,
    MeetingBookType,
    GET_FILE_ICON
} from '../../../../../models';

export interface IContentsSidebarCtrlProps {

    items: Array<IMeetingBookItem>;
    selectedItem: IMeetingBookItem;

    onItemSelected: (item: IMeetingBookItem) => void;

}

export class ContentsSidebarCtrl extends React.Component<IContentsSidebarCtrlProps, any> {

    constructor(props: IContentsSidebarCtrlProps) {

        super(props);

    }

    public render(): React.ReactElement<IContentsSidebarCtrlProps> {

        return (
                <div className="row" data-view="grid">

                    { !!this.props.items &&
                        this.props.items.map( i => {

                            let iconName = GET_FILE_ICON(i.FileExtension);

                            return (
                                <div className="col-xs-12" key={i.Id}>
                                    <a
                                        className={i.Id === this.props.selectedItem.Id ? 'active': ''}
                                        href={i.Url}
                                        target="_blank"
                                        onClick={(e:any) => this.selectItem(e, i)}
                                    >
                                        {i.Type !== 'calendar' &&

                                            <span className="item-img">
                                                <img
                                                    src={i.ThumbnailUrl}

                                                    onError={
                                                        (e: any)=>{
                                                            e.target.parentNode.style.display = 'none';
                                                        }}
                                                />
                                            </span>

                                        }

                                        <h5>
                                            <i className={iconName} aria-hidden="true"></i>
                                            <span
                                                className="item-title"
                                            >
                                                {!!i.Filename ? i.Filename : i.Title}
                                            </span>
                                        </h5>
                                    </a>
                                </div>
                            );
                        })
                    }

                </div>
        );
    }

    @autobind
    private selectItem(e: any, item: IMeetingBookItem) {

        if(!!item.OpenInNewTab)
            return;

        e.preventDefault();
        e.stopPropagation();

        this.props.onItemSelected(item);

    }

}
