import * as React from 'react';

export interface PDFRendererProps {
    
}
 
export interface PDFRendererState {
    
}
 
class PDFRenderer extends React.Component<PDFRendererProps, PDFRendererState> {
    constructor(props: PDFRendererProps) {
        super(props);
        this.state = null;
    }

    public render() { 
        return (  
            <div></div>
        );
    }
}
 
export default PDFRenderer;