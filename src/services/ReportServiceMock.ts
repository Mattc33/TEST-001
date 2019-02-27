import { IReportBasicItem } from "../models/IReportItem";
import { IReportService } from "./interfaces/IReportService";

export class ReportServiceMock implements IReportService {

    public getAllFeaturedReports(): Promise<Array<IReportBasicItem>> {
      return new Promise<Array<IReportBasicItem>>((resolve:any) => {

        const fakeData: Array<IReportBasicItem> = [

            {
                Id:"1",
                Title: 'Pharmaceutical Sales Performance 1',
                SVPVisualizationDescription: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"2",
                Title: 'Corporate Finance Executive Summary 2',
                SVPVisualizationDescription: 'Whereas synchronized brand values promote strategy formulations',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"3",
                Title: 'Healthcare Product Performance Analysis & Forecast 3',
                SVPVisualizationDescription: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"4",
                Title: 'Financial Services Key Risk Indicators 4',
                SVPVisualizationDescription: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"5",
                Title: 'Retail Field Team Growth Scorecard 5',
                SVPVisualizationDescription: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"6",
                Title: 'Corporate Finance Executive Summary 6',
                SVPVisualizationDescription: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"7",
                Title: 'Public Education Instructor Salaries 7',
                SVPVisualizationDescription: 'Whereas synchronized brand values promote strategy formulations',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"8",
                Title: 'Student Loan Analysis 8',
                SVPVisualizationDescription: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"9",
                Title: 'Pharmaceutical Sales Performance 9',
                SVPVisualizationDescription: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"10",
                Title: 'Corporate Finance Executive Summary 10',
                SVPVisualizationDescription: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"11",
                Title: 'Healthcare Product Performance Analysis & Forecast 11',
                SVPVisualizationDescription: 'Whereas synchronized brand values promote strategy formulations',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"12",
                Title: 'Financial Services Key Risk Indicators 12',
                SVPVisualizationDescription: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"13",
                Title: 'Retail Field Team Growth Scorecard 13',
                SVPVisualizationDescription: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"14",
                Title: 'Public Education Instructor Salaries 14',
                SVPVisualizationDescription: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"15",
                Title: 'Student Loan Analysis 15',
                SVPVisualizationDescription: 'Whereas synchronized brand values promote strategy formulations',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"16",
                Title: 'Healthcare Product Performance Analysis & Forecast 16',
                SVPVisualizationDescription: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"17",
                Title: 'Retail Field Team Growth Scorecard 17',
                SVPVisualizationDescription: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"18",
                Title: 'Public Education Instructor Salaries 18',
                SVPVisualizationDescription: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"19",
                Title: 'Pharmaceutical Sales Performance 19',
                SVPVisualizationDescription: 'Whereas synchronized brand values promote strategy formulations',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"20",
                Title: 'Healthcare Product Performance Analysis & Forecast 20',
                SVPVisualizationDescription: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"21",
                Title: 'Corporate Finance Executive Summary 21',
                SVPVisualizationDescription: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"22",
                Title: 'Retail Field Team Growth Scorecard 22',
                SVPVisualizationDescription: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"23",
                Title: 'Public Education Instructor Salaries 23',
                SVPVisualizationDescription: 'Whereas synchronized brand values promote strategy formulations',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"24",
                Title: 'Student Loan Analysis 24',
                SVPVisualizationDescription: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            }
        ];

        resolve(fakeData);
      });
    }
}
  