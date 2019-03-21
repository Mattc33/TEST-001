import * as React from 'react';



export interface IReportCommentsProps {
  //description: string;
}

export interface IReportCommentsState {
  
}


export default class ReportComments extends React.Component<IReportCommentsProps, IReportCommentsState> {

  constructor(props:IReportCommentsProps) {
    super(props);


  }

  public componentDidMount(): void {

  }
  public render(): React.ReactElement<IReportCommentsProps>{

    return (
      <div>
        HTML Tutorial <br/>
        CSS Tutorial <br/>
        JavaScript Tutorial<br/>
        How To Tutorial<br/><br/>
        W3.CSS Tutorial<br/>
        Bootstrap Tutorial<br/>
        SQL Tutorial<br/>
        PHP 5 Tutorial<br/>
        PHP 7 Tutorial<br/>
        jQuery Tutorial<br/>
        Python Tutorial<br/>
      </div>

    );

  }

}