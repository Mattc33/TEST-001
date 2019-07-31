import * as React from 'react';
import styles from './contentCarouselControl.module.scss';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { chunk } from '@microsoft/sp-lodash-subset';
import { Carousel } from 'react-responsive-carousel';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

require("./content-carousel-control.css");


import {
    IMeetingBookItem,
    GET_FILE_ICON
} from '../../../../../models';


export interface IContentsCarouselCtrlProps {

    items: Array<IMeetingBookItem>;
    selectedItem: IMeetingBookItem;

    onItemSelected: (item: IMeetingBookItem) => void;

}

export interface IContentsCarouselCtrlState {
    currentSlideIndex: number;
    carouselOpen: boolean;
}

declare type selectedItemHandler = (e: any, item: IMeetingBookItem) => void;
declare type changeSlideHandler = (index: number, e: any) => void;

const GetSlide = ((
    book: IMeetingBookItem,
    currentSelectedId: number,
    handler: selectedItemHandler
) => {

    const iconName = GET_FILE_ICON(book.FileExtension);

    return (
        <div className={ styles.contentCarouselControl }>
            <div className={"svp-mtgbk-item" + (book.Id === currentSelectedId ? " carousel__item--active" : "") }>

                { book.Url === 'ERROR' &&
                    <div>
                        <span  
                            //className={styles["svp-carousel-fileicon"]} 
                            onClick={(e:any) => handler(e, book)}
                        >
                                <i style={{ fontSize: '150%' }} className={iconName} aria-hidden="true"></i>
                                
                        </span>

                        <span  
                           // className="svp-carousel-link"
                            onClick={(e:any) => handler(e, book)}
                        >
                                { !!book.Filename ? book.Filename : book.Title }
                        </span>

                    </div>
                }

                { book.Url !== 'ERROR' &&

                    <div className="svp-mtgbk-itemdiv"> 
                        <div className="svp-mtgbk-leftside">
                        <a 
                            href={book.Url}
                            target="_blank"
                            onClick={(e:any) => handler(e, book)}>
                                <i style={{ fontSize: '150%' }} className={iconName} aria-hidden="true"></i>
                                
                        </a>

                        <a 
                            href={book.Url}
                            target="_blank" 
                            onClick={(e:any) => handler(e, book)}>
                                { !!book.Filename ? book.Filename : book.Title }
                        </a>
                        </div>
                        <div className="svp-mtgbk-newwindowdiv">
                        <a 
                            href={book.Url}
                            target="_blank">
                                <Icon iconName="OpenInNewWindow" className="svp-mtgbk-newwindow"></Icon>
                        </a>
                    </div>
                    </div>
                }

                

            </div>
        </div>
    );
});

const GetCarousel = ((
    books: IMeetingBookItem[], 
    slideIndex: number, 
    currentSelected: IMeetingBookItem, 
    selHandler: selectedItemHandler, 
    chgHandler: changeSlideHandler
) => {
    const booksChunk = chunk<IMeetingBookItem>(books, 4);
    const slides = booksChunk.map((slideData: IMeetingBookItem[]): JSX.Element => {
        const slide = slideData.map((book: IMeetingBookItem) => {
            return GetSlide(book, (currentSelected) ? currentSelected.Id : -1, selHandler);
        }); 

        return (
            <div className="meetingbookcarousel">
                <div className="meetingbookthumbsitems">
                    { slide }
                </div>
             </div>
        );

    });

    return (
        <Carousel 
            showStatus={false}
            showThumbs={false}
            selectedItem={slideIndex}
            onChange={chgHandler}
        >
            { slides }
        </Carousel>
    );
});

export class ContentsCarouselCtrl extends React.Component<IContentsCarouselCtrlProps, IContentsCarouselCtrlState> {

    constructor(props: IContentsCarouselCtrlProps) {
        super(props);

        this.state = {
            currentSlideIndex: 0,
            carouselOpen: true
        };
    }

    public render(): React.ReactElement<IContentsCarouselCtrlProps> {
        const carousel = (!!this.props.items)
            ? GetCarousel(this.props.items, 
                          this.state.currentSlideIndex, 
                          this.props.selectedItem, 
                          this.selectItem, 
                          this.slideChange)
            : <div>Loading...</div>;

        const arrowIcon = (this.state.carouselOpen) 
            ? <Icon iconName="ChevronDown" className="svp-mtgbk-openclose"></Icon>  
            : <Icon iconName="ChevronUp" className="svp-mtgbk-openclose"></Icon> ;
        const openStyle: React.CSSProperties = (this.state.carouselOpen) 
            ? { display: 'block' } 
            : { display: 'none' };

        return (
            <div>
                <div className="meetingbookthumbs" style={openStyle}>
                    { carousel }
                </div>
                <div className="meetingbookexpcoll">
                    <div onClick={this.toggleCarousel} className="expand-and-collapse">
                        <a href="#">
                            { arrowIcon }
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    @autobind
    private toggleCarousel(e: React.SyntheticEvent<HTMLDivElement>) {

        e.preventDefault();
        e.stopPropagation();

        this.setState({ carouselOpen: !this.state.carouselOpen });

    }

    @autobind
    private slideChange(index: number, e: any)  {

        this.setState({ currentSlideIndex: index });

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
