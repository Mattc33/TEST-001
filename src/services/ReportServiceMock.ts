import { IReportBasicItem } from "../models/IReportItem";
import { IReportService } from "./interfaces/IReportService";

export class ReportServiceMock implements IReportService {

    public getAllFeaturedReports(): Promise<Array<IReportBasicItem>> {
      return new Promise<Array<IReportBasicItem>>((resolve:any) => {

        const fakeData: Array<IReportBasicItem> = [

            {
                Id:"1",
                Title: 'Pharmaceutical Sales Performance',
                SVPVisualizationDescription: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"1",
                Title: 'Corporate Finance Executive Summary',
                SVPVisualizationDescription: 'Whereas synchronized brand values promote strategy formulations',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"1",
                Title: 'Healthcare Product Performance Analysis & Forecast',
                SVPVisualizationDescription: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"1",
                Title: 'Financial Services Key Risk Indicators',
                SVPVisualizationDescription: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"1",
                Title: 'Retail Field Team Growth Scorecard',
                SVPVisualizationDescription: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"1",
                Title: 'Public Education Instructor Salaries',
                SVPVisualizationDescription: 'Whereas synchronized brand values promote strategy formulations',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"1",
                Title: 'Student Loan Analysis',
                SVPVisualizationDescription: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"1",
                Title: 'Pharmaceutical Sales Performance',
                SVPVisualizationDescription: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"1",
                Title: 'Corporate Finance Executive Summary',
                SVPVisualizationDescription: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"1",
                Title: 'Healthcare Product Performance Analysis & Forecast',
                SVPVisualizationDescription: 'Whereas synchronized brand values promote strategy formulations',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"1",
                Title: 'Financial Services Key Risk Indicators',
                SVPVisualizationDescription: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"1",
                Title: 'Retail Field Team Growth Scorecard',
                SVPVisualizationDescription: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"1",
                Title: 'Public Education Instructor Salaries',
                SVPVisualizationDescription: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"1",
                Title: 'Student Loan Analysis',
                SVPVisualizationDescription: 'Whereas synchronized brand values promote strategy formulations',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"1",
                Title: 'Healthcare Product Performance Analysis & Forecast',
                SVPVisualizationDescription: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"1",
                Title: 'Retail Field Team Growth Scorecard',
                SVPVisualizationDescription: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"1",
                Title: 'Public Education Instructor Salaries',
                SVPVisualizationDescription: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"1",
                Title: 'Pharmaceutical Sales Performance',
                SVPVisualizationDescription: 'Whereas synchronized brand values promote strategy formulations',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"1",
                Title: 'Healthcare Product Performance Analysis & Forecast',
                SVPVisualizationDescription: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"1",
                Title: 'Corporate Finance Executive Summary',
                SVPVisualizationDescription: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"1",
                Title: 'Retail Field Team Growth Scorecard',
                SVPVisualizationDescription: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:"1",
                Title: 'Public Education Instructor Salaries',
                SVPVisualizationDescription: 'Whereas synchronized brand values promote strategy formulations',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"1",
                Title: 'Student Loan Analysis',
                SVPVisualizationDescription: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:"1",
                Title: 'Corporate Finance Executive Summary',
                SVPVisualizationDescription: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPVisualizationImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            }
        ];

        resolve(fakeData);
      });
    }
}
  