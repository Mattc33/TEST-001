import * as React from 'react';
import styles from '../SharedActionBtn.module.scss';

// Third Party
import { Icon } from 'office-ui-fabric-react';

interface IIsLikedIconElement {
   removeLike: any;
}

interface IIsNotLikedIconElement {
   addLike: any;
}

export const IsLikedIconElement = (props: IIsLikedIconElement): JSX.Element => (
   <div onClick={props.removeLike} style={{cursor: 'pointer'}}>
      <Icon iconName='LikeSolid' aria-hidden='true' />&nbsp;
      <span className={styles.ItemSelected}>Like</span>
   </div>
);

export const IsNotLikedIconElement = (props: IIsNotLikedIconElement): JSX.Element => (
   <div onClick={props.addLike} style={{ cursor: 'pointer' }}>
      <Icon iconName='Like' aria-hidden='true' />&nbsp;
      <span className={styles.ItemUnselected}>Like</span>
   </div>
);