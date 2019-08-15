export interface IReportLearnPanelProps {
   reportRichText: string;
   reportTitle: string;
   onCancel(): void;
   report: any;
}

export interface IReportLearnPanelState {
   showLearnPanel: boolean;
}