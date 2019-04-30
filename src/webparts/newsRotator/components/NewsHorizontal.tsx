import * as React from 'react';
import styles from './NewsHorizontal.module.scss';
import { INewsItem } from "../../../models/INewsItem";

export interface INewsProps {
  key: number;
  newsItem: INewsItem;
  siteUrl:string;
}

export default class NewsHorizontal extends React.Component<INewsProps, {}> {

    public render(): React.ReactElement<INewsProps> {
        const rowStyle = {
          display: 'inline-flex',
        };
    
        const colStyle = {
          background: '#EEF0F2',
        };
    
        const reportURL = this.props.siteUrl + "/Lists/SyscoNews/DispForm.aspx?ID=" + this.props.newsItem.Id;
    
        return (
          <div className={styles.newsHorizontal}>
            <div className={styles.wrapper}>
              
              <div className="row" style={rowStyle}>
                <div className="col-md-12" style={colStyle}>
                  <a href={reportURL} className={styles.url} role="presentation" target="_blank" aria-hidden="true" data-is-focusable="false" data-interception="propagate">
                    <img src={this.props.newsItem.SVPNewsBackgroundImage} className={styles.image} /> 
                    <div>
                      <p className={styles.title}>{this.props.newsItem.Title}</p>
                    </div>
                    <div>
                      <p className={styles.subTitle}>{this.props.newsItem.SVPNewsSubTitle}</p>
                    </div>
                    <div>
                      <p className={styles.button}>READ MORE</p>
                    </div>
                    
                  </a>  
                </div>
              </div>
               
            </div>
          </div>
        );
      }
    




}
