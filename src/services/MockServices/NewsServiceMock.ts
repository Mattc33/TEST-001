import { INewsItem } from "../../models/INewsItem";
import { INewsService } from "../interfaces/INewsService";

export class NewsServiceMock implements INewsService {

    public getAllFeaturedNews(): Promise<Array<INewsItem>> {
      return new Promise<Array<INewsItem>>((resolve:any) => {

        const fakeData: Array<INewsItem> = [

            {
                Id:1,
                Title: 'Pharmaceutical Sales Performance 1',
                SVPNewsSubTitle: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:2,
                Title: 'Corporate Finance Executive Summary 2',
                SVPNewsSubTitle: 'Whereas synchronized brand values promote strategy formulations',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:3,
                Title: 'Healthcare Product Performance Analysis & Forecast 3',
                SVPNewsSubTitle: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:4,
                Title: 'Financial Services Key Risk Indicators 4',
                SVPNewsSubTitle: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:5,
                Title: 'Retail Field Team Growth Scorecard 5',
                SVPNewsSubTitle: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:6,
                Title: 'Corporate Finance Executive Summary 6',
                SVPNewsSubTitle: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:7,
                Title: 'Public Education Instructor Salaries 7',
                SVPNewsSubTitle: 'Whereas synchronized brand values promote strategy formulations',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:8,
                Title: 'Student Loan Analysis 8',
                SVPNewsSubTitle: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:9,
                Title: 'Pharmaceutical Sales Performance 9',
                SVPNewsSubTitle: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:10,
                Title: 'Corporate Finance Executive Summary 10',
                SVPNewsSubTitle: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:11,
                Title: 'Healthcare Product Performance Analysis & Forecast 11',
                SVPNewsSubTitle: 'Whereas synchronized brand values promote strategy formulations',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:12,
                Title: 'Financial Services Key Risk Indicators 12',
                SVPNewsSubTitle: 'The thinkers/planners benchmark a disciplined growth momentum',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:13,
                Title: 'Retail Field Team Growth Scorecard 13',
                SVPNewsSubTitle: 'We are working hard to reintermediate a competitive advantage, while the gatekeeper straightforwardly identifies barriers to success',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            },
            {
                Id:14,
                Title: 'Public Education Instructor Salaries 14',
                SVPNewsSubTitle: 'The General Head of IT Strategy benchmarks business-for-business agilities',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PharmaSalesPerformance.JPG'
            },
            {
                Id:15,
                Title: 'Student Loan Analysis 15',
                SVPNewsSubTitle: 'Whereas synchronized brand values promote strategy formulations',
                SVPNewsBackgroundImage: 'https://bigapplesharepoint.sharepoint.com/sites/SlalomViewport/ReportImages/PMPortfolio2.JPG'
            }
        ];

        resolve(fakeData);
      });
    }
}
  