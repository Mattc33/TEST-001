import * as React from 'react';
import styles from '../SharedActionBtn.module.scss';

// Third Party
import { ActionButton } from 'office-ui-fabric-react';

interface IIsFavoriteIconElement {
   unfavorite: () => void;
}

interface IIsNotFavoriteIconElement {
   showFavoriteDialog: () => void;
}

export const IsFavoriteIconElement = (props: IIsFavoriteIconElement): JSX.Element => (
   <ActionButton
      className={styles.ItemSelected}
      data-automation-id="HeartFill"
      iconProps={{ iconName: 'HeartFill' }}
      allowDisabledFocus={true}
      title="Remove report from favorite list"
      onClick={props.unfavorite}
   >
      Favorite
   </ActionButton>
);

export const IsNotFavoriteIconElement = (props: IIsNotFavoriteIconElement): JSX.Element => (
   <ActionButton
      className={styles.ItemUnselected}
      data-automation-id="HeartFill"
      iconProps={{ iconName: 'HeartFill' }}
      allowDisabledFocus={true}
      title="Add report to favorite list"
      onClick={props.showFavoriteDialog}>
         Favorite
    </ActionButton>
);



