import * as React from 'react';
import styles from './ReportAdaptiveCard.module.scss';
import * as AdaptiveCards from "adaptivecards";
import { IReportBasicItem } from "../../../models/IReportItem";
import { autobind } from '@uifabric/utilities';

export interface IAdaptiveCardsImageGalleryProps {
  key: number;
  reportItem: IReportBasicItem;
  siteUrl:string;

}


export default class AdaptiveCardsImageGallery extends React.Component<IAdaptiveCardsImageGalleryProps, {}> {
  private card: any;
  private renderedCard: any = "";
  private imagesJSON = [];
  private reportURL:string;
  //private adaptiveCard: any;

  constructor(props: IAdaptiveCardsImageGalleryProps) {
    super(props);
    
  }

  public componentDidMount():void {
    //this.createCard();

  }

  public render(): React.ReactElement<IAdaptiveCardsImageGalleryProps> {
    
    this.createCard();

    return (
      <div className={styles.reportAdaptiveCard}>
        <div className={styles.container}>
          <div><h4>{this.props.reportItem.Title}</h4></div>
          <div ref={(n) => { n && n.appendChild(this.renderedCard) }} />
        </div>
      </div>
    );
  }


  private createCard():void {
    try{
      //this.reportURL = this.props.siteUrl + "/SitePages/ViewReport.aspx?reportId=" + this.props.reportItem.Id;
    
      const reportURL = "/SitePages/ViewReport.aspx?reportId=" + this.props.reportItem.Id;
        let image = {};
        image["type"] = "Image";
        image["url"] = this.props.reportItem.SVPVisualizationImage;         
  
      // Compose image action
      let imageAction = {};
      imageAction["title"] = this.props.reportItem.Title;
      imageAction["type"] = "Action.OpenUrl";
      imageAction["url"] = reportURL;
      imageAction["iconUrl"] = reportURL;
  
      image["selectAction"] = imageAction;
      this.imagesJSON.push(image);
      
      this.card = {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [
          {
            "type": "TextBlock",
            "text": "",
            "size": "medium"
          },
          {
            "type": "ImageSet",
            "imageSize": "medium",
            "images": this.imagesJSON
          }
        ]
      };
  
      // Create an AdaptiveCard instance
      var adaptiveCard = new AdaptiveCards.AdaptiveCard();
  
      // Set its hostConfig property unless you want to use the default Host Config
      // Host Config defines the style and behavior of a card
      adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
        fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
      });
  
      // Set the adaptive card's event handlers. onExecuteAction is invoked
      // whenever an action is clicked in the card
      
      adaptiveCard.onExecuteAction = function(action) { 
        window.location.href = action.iconUrl;
      };
  
      // Parse the card
      adaptiveCard.parse(this.card);
  
      // Render the card to an HTML element
      //this.renderedCard = adaptiveCard.render();
      this.renderedCard = adaptiveCard.render();

    }
    catch(error){  
     console.log(error);
    }

  }

}

