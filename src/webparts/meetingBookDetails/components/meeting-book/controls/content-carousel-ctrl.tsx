import * as React from 'react';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { chunk } from '@microsoft/sp-lodash-subset';
import { Carousel } from 'react-responsive-carousel';
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
        <div className={"col-sm-3" + (book.Id === currentSelectedId ? " carousel__item--active" : "") }>

            { book.Url === 'ERROR' &&
                <div>
                    <span  
                        className="wmg-carousel-fileicon"
                        onClick={(e:any) => handler(e, book)}
                    >
                            <i style={{ fontSize: '150%' }} className={iconName} aria-hidden="true"></i>
                    </span>

                    <span  
                        className="wmg-carousel-link"
                        onClick={(e:any) => handler(e, book)}
                    >
                            { !!book.Filename ? book.Filename : book.Title }
                    </span>

                </div>
            }

            { book.Url !== 'ERROR' &&

                <div>
                    <a  className="wmg-carousel-fileicon"
                        href={book.Url}
                        target="_blank"
                        onClick={(e:any) => handler(e, book)}>
                            <i style={{ fontSize: '150%' }} className={iconName} aria-hidden="true"></i>
                    </a>

                    <a  className="wmg-carousel-link"
                        href={book.Url}
                        target="_blank"
                        onClick={(e:any) => handler(e, book)}>
                            { !!book.Filename ? book.Filename : book.Title }
                    </a>

                    <a  className="wmg-carousel-exticon"
                        href={book.Url}
                        target="_blank">
                            <i className="demo-icon icon-link-ext-alt"></i>
                    </a>
                </div>

            }

            

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
            <div className="col-sm-12 meetingbookcarousel">
                <div className="row meetingbookthumbsitems">
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
            ? <i className="demo-icon icon-up-arrow"></i> 
            : <i className="demo-icon icon-down-arrow"></i>;
        const openStyle: React.CSSProperties = (this.state.carouselOpen) 
            ? { display: 'block' } 
            : { display: 'none' };

        return (
            <div>
                <div className="row meetingbookthumbs" style={openStyle}>
                    { carousel }
                </div>
                <div className="row meetingbookexpcoll">
                    <div onClick={this.toggleCarousel} className="col-sm-12 expand-and-collapse">
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
