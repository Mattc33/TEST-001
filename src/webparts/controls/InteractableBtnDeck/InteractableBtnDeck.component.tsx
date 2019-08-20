import * as React from 'react';
import styles from './SharedActionBtn.module.scss';

// Third Party
import { Spinner, SpinnerSize, autobind } from 'office-ui-fabric-react';

// Components
import { IsFavoriteIconElement, IsNotFavoriteIconElement, IsLikedIconElement, IsNotLikedIconElement, ShareIconElement } from './InteractableBtnDeck.index';

// Services
import { ReportActionsService, IFavoriteState } from '../../../services/ReportActionsService/ReportActionsService';

// Interfaces
import { IInteractableBtnDeckProps, IInteractableBtnDeckState } from './InteractableBtnDeck.interface';

export default class InteractableBtnDeck extends React.Component<IInteractableBtnDeckProps, IInteractableBtnDeckState> {

   private actionsService: ReportActionsService;
   private busyElement: JSX.Element = <Spinner size={SpinnerSize.small} />;

   public state = {
      busyFavoriting: false,
      busyLiking: false,
      isFavorite: false,
      isLiked: false
   }

   public render = () => {
      return (
         <aside className={styles['Tile-Header-Interactable-Icons-Container']}>
            <div className={styles['Tile-Header-Favorite-Icon']}>
               <span>
                  {this.state.busyFavoriting && this.busyElement}
                  {
                     !this.state.busyFavoriting && this.state.isFavorite &&
                     <IsFavoriteIconElement unfavorite={this.unfavorite} />
                  }
                  {
                     !this.state.busyFavoriting && !this.state.isFavorite &&
                     <IsNotFavoriteIconElement showFavoriteDialog={this.showFavoriteDialog} />
                  }
               </span>
            </div>
            <div className={styles['Tile-Header-Share-Icon']}>
               <ShareIconElement shareReport={this.shareReport} />
            </div>
            <div className={styles['Tile-Header-Like-Icon']}>
               <span>
                  {this.state.busyLiking && this.busyElement}
                  {!this.state.busyLiking && this.state.isLiked &&
                     <IsLikedIconElement removeLike={this.removeLike} />
                  }
                  {!this.state.busyLiking && !this.state.isLiked &&
                     <IsNotLikedIconElement addLike={this.addLike} />
                  }
               </span>
            </div>
         </aside>
      )
   }

   private unfavorite = async () => {
      this.setState({ busyFavoriting: true });
      let itemId: number = parseInt(this.props.result.ListItemId);
      let successItem: any = {};
      try {
         await this.actionsService.UnfavoriteReport(this.props.result.SPWebUrl, itemId);
         successItem = { isFavorite: false };
      } catch (ex) {
         console.log(`Couldn't unfavorite item ${itemId}.`);
      }
      finally {
         const state = { ...this.state, ...successItem, busyFavoriting: false };
         this.setState(state);
      }
   }

   


}
