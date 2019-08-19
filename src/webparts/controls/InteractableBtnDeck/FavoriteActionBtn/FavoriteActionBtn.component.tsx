import * as React from 'react';
import styles from '../SharedActionBtn.module.scss';

// Third Party
import { ActionButton } from 'office-ui-fabric-react';

export const IsFavoriteIconElement = (props): JSX.Element => (
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
)

export const IsNotFavoriteIconElement = (props): JSX.Element => (
   <ActionButton
      className={styles.ItemUnselected}
      data-automation-id="HeartFill"
      iconProps={{ iconName: 'HeartFill' }}
      allowDisabledFocus={true}
      title="Add report to favorite list"
      onClick={props.showFavoriteDialog}>
         Favorite
    </ActionButton>
)



