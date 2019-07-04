import * as React from 'react';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

export enum LoadState {
    Initialized = 0,
    Success = 1,
    Error = 3
}

export interface IImageFallbackProps {
    src: string;
}

export interface IImageFallbackState {
    loadState: LoadState;
}

export class ImageFallback extends React.Component<IImageFallbackProps, IImageFallbackState> {
    constructor(props: IImageFallbackProps) {
      super(props);

      this.state = {
        loadState: LoadState.Initialized
      };
    }
  
    @autobind
    private OnLoadError() {
        this.setState({ loadState: LoadState.Error });
    }

    public render() {
        const imgFix: React.CSSProperties = {
            pointerEvents: 'all'
        };
        return (this.state.loadState === LoadState.Initialized) 
            ? <img src={this.props.src} style={imgFix} onError={this.OnLoadError} />
            : React.Children.only(this.props.children);
    }
}