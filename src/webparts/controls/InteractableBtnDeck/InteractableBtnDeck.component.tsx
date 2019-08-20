import * as React from 'react';
import styles from './SharedActionBtn.module.scss';

// Third Party

// Components
import { IsFavoriteIconElement, IsNotFavoriteIconElement, IsLikedIconElement, IsNotLikedIconElement, ShareIconElement } from './InteractableBtnDeck.index';

// Interfaces
import { IInteractableBtnDeckProps, IInteractableBtnDeckState } from './InteractableBtnDeck.interface';

export default class InteractableBtnDeck extends React.Component<IInteractableBtnDeckProps, IInteractableBtnDeckState> {

   public state = {

   }



   public render = () => {

      return <div></div>

   //    return (
   //       <aside className={resultTileStyles['Tile-Header-Interactable-Icons-Container']}>
   //          <div className={resultTileStyles['Tile-Header-Favorite-Icon']}>
   //             <span>
   //                {this.state.busyFavoriting && this.busyElement}
   //                {
   //                   !this.state.busyFavoriting && this.state.isFavorite &&
   //                   <IsFavoriteIconElement unfavorite={this.unfavorite} />
   //                }
   //                {
   //                   !this.state.busyFavoriting && !this.state.isFavorite &&
   //                   <IsNotFavoriteIconElement showFavoriteDialog={this.showFavoriteDialog} />
   //                }
   //             </span>
   //          </div>
   //          <div className={resultTileStyles['Tile-Header-Share-Icon']}>
   //             <ShareIconElement shareReport={this.shareReport} />
   //          </div>
   //          <div className={resultTileStyles['Tile-Header-Like-Icon']}>
   //             {hideLike &&
   //                <span>
   //                   {this.state.busyLiking && this.busyElement}
   //                   {!this.state.busyLiking && this.state.isLiked &&
   //                      <IsLikedIconElement removeLike={this.removeLike} />
   //                   }
   //                   {!this.state.busyLiking && !this.state.isLiked &&
   //                      <IsNotLikedIconElement addLike={this.addLike} />
   //                   }
   //                </span>
   //             }
   //          </div>
   //       </aside>
   //    )
   // }
   }

}
