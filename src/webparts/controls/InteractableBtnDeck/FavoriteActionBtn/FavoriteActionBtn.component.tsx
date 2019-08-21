import * as React from 'react';
import styles from '../SharedActionBtn.module.scss';

// Third Party
import { ActionButton } from 'office-ui-fabric-react';

type small = 'small';
interface IIsFavoriteIconElement {
   unfavorite: any;
   size?: small;
   text: string;
}

interface IIsNotFavoriteIconElement {
   showFavoriteDialog?: any;
}

export const IsFavoriteIconElement = (props: IIsFavoriteIconElement): JSX.Element => (
   <ActionButton
      className={(props.size === 'small') ? styles.ItemSelectedSmall : styles.ItemSelected}
      data-automation-id="HeartFill"
      iconProps={{ iconName: 'HeartFill' }}
      allowDisabledFocus={true}
      title="Remove report from favorite list"
      onClick={props.unfavorite}
   >
      {props.text}
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



