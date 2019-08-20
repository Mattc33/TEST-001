import * as React from 'react';
import styles from '../SharedActionBtn.module.scss';

export const IsLikedIconElement = (): JSX.Element => (
   <span onClick={this.removeLike}>
      <i className={"ms-Icon ms-Icon--LikeSolid" + styles.ItemSelected} aria-hidden="true"></i>&nbsp;
      <span className={styles.ItemSelected}>Like</span>
   </span>
);

export const IsNotLikedIconElement = (): JSX.Element => (
   <span onClick={this.addLike}>
      <i className={"ms-Icon ms-Icon--Like" + styles.ItemUnselected} aria-hidden="true"></i>&nbsp;
      <span className={styles.ItemUnselected}>Like</span>
   </span>
);