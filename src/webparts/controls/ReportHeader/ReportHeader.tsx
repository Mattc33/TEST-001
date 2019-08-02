import * as React from "react";
import styles from "./ReportHeader.module.scss";

export interface IReportHeaderProps {
    title: string;
    lastModified: string;
    metadata?: string;

    segment?: string;
    function?: string;
    frequency?: string;

    likeCount?:string;
    viewCount?:string;
}

export interface IHeaderSectionProps {
    title?: string;
    value?: string;
}

export const HeaderSection: React.FunctionComponent<IHeaderSectionProps> = props => {
    return (!props.title || !props.value)
        ? null
        : (
            <React.Fragment>
                <label> | </label>
                <label className="ms-fontWeight-semibold">{props.title + ": "}</label>
                <label className="ms-fontWeight-regular">{props.value}</label>
            </React.Fragment>
        );
};

export const ReportHeader: React.FunctionComponent<IReportHeaderProps> = props => {
  return (
    <React.Fragment>
        <div>
            <label className={styles.reportTitle}>{props.title}</label>
            <label className="ms-fontWeight-regular">{props.metadata}</label>
            {/* <HeaderSection title={"Last Modified"} value={props.lastModified} /> */}
            <HeaderSection title={"Segment"} value={props.segment} />
            <HeaderSection title={"Function"} value={props.function} />
            <HeaderSection title={"Frequency"} value={props.frequency} />
            <HeaderSection title={"Likes Count"} value={props.likeCount} />
            <HeaderSection title={"Views Count"} value={props.viewCount} />
            <hr className={styles.divider} />
        </div>
    </React.Fragment>
  );
};
