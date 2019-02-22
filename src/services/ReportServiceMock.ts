import { IReportItem } from "../models/IReportItem";
import { IReportService } from "./interfaces/IReportService";

export class ReportServiceMock implements IReportService {

    public getAllFeaturedReports(): Promise<Array<IReportItem>> {
      return new Promise<Array<IReportItem>>((resolve:any) => {

        const fakeData: Array<IReportItem> = [

            {
                title: 'Pharmaceutical Sales Performance',
                description: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                title: 'Corporate Finance Executive Summary',
                description: 'Whereas synchronized brand values promote strategy formulations',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                title: 'Healthcare Product Performance Analysis & Forecast',
                description: 'The thinkers/planners benchmark a disciplined growth momentum',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                title: 'Financial Services Key Risk Indicators',
                description: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                title: 'Retail Field Team Growth Scorecard',
                description: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                title: 'Public Education Instructor Salaries',
                description: 'Whereas synchronized brand values promote strategy formulations',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                title: 'Student Loan Analysis',
                description: 'The thinkers/planners benchmark a disciplined growth momentum',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                title: 'Pharmaceutical Sales Performance',
                description: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                title: 'Corporate Finance Executive Summary',
                description: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                title: 'Healthcare Product Performance Analysis & Forecast',
                description: 'Whereas synchronized brand values promote strategy formulations',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                title: 'Financial Services Key Risk Indicators',
                description: 'The thinkers/planners benchmark a disciplined growth momentum',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                title: 'Retail Field Team Growth Scorecard',
                description: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                title: 'Public Education Instructor Salaries',
                description: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                title: 'Student Loan Analysis',
                description: 'Whereas synchronized brand values promote strategy formulations',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                title: 'Healthcare Product Performance Analysis & Forecast',
                description: 'The thinkers/planners benchmark a disciplined growth momentum',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                title: 'Retail Field Team Growth Scorecard',
                description: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                title: 'Public Education Instructor Salaries',
                description: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                title: 'Pharmaceutical Sales Performance',
                description: 'Whereas synchronized brand values promote strategy formulations',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                title: 'Healthcare Product Performance Analysis & Forecast',
                description: 'The thinkers/planners benchmark a disciplined growth momentum',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                title: 'Corporate Finance Executive Summary',
                description: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                title: 'Retail Field Team Growth Scorecard',
                description: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                title: 'Public Education Instructor Salaries',
                description: 'Whereas synchronized brand values promote strategy formulations',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                title: 'Student Loan Analysis',
                description: 'The thinkers/planners benchmark a disciplined growth momentum',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                title: 'Corporate Finance Executive Summary',
                description: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                imageUrl: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            }
        ];

        resolve(fakeData);
      });
    }
}
  