import * as React from 'react';
import styles from '../SharedActionBtn.module.scss';

// Third Party
import { ActionButton } from 'office-ui-fabric-react';

export const ShareIconElement = (props): JSX.Element => (
   <ActionButton
      className={styles.ItemSelected}
      data-automation-id="Share"
      iconProps={{ iconName: 'Share' }}
      allowDisabledFocus={true}
      title="Share Report"
      onClick={props.shareReport}>
      Share
    </ActionButton>
)