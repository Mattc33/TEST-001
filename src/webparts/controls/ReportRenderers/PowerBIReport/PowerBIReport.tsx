import * as React from 'react';
import { autobind } from 'office-ui-fabric-react';
import Report from 'powerbi-report-component';
import Iframe from 'react-iframe'

declare var powerbi: any;

export const POWERBI_SUPPORTED_TOOLBAR = ["comment", "sizing", "savecustom", "feedback", "share", "fullscreen"];


export interface IPowerBIReportProps {
    reportURL: string;
    height?: number;
    width?: number;
}
 
export interface IPowerBIReportState {
    
}

class PowerBIReport extends React.Component<IPowerBIReportProps,IPowerBIReportState> {

    private Viz: any;
    private report: any;
    private VizLoaded: boolean;
    private accesstoken = 'H4sIAAAAAAAEACWWxQ70CA6E3-W_9khhGmkO6TAz3sLMnNW--_Zo7z7Y5XJ9_s8fM3n6Kcn__P1HQ2Meauxk9U0KxPj7YEWF6-sCPqLuvp0UdYrNbQMNkXhSaV1jNJrC622xSvwHibVPNm8dmH9wUjGW9MW005MU6YHWtBivAiLwArhtVxDdyryLFnFC5Si248KMcVHNZk80bryQLqX1tMbp3m4WzFGYDZT0ejnYzIi3bEfpPcX7LG_FO_zy8UwERMDL9x32x7daestwrRsnZmB4DLerp60x3m7Q64l52ccn24rOFH0MzzRJ2G5Ds--B7llnYYBvSPpw3KjcHTruMo0IfsEe9KWjhtkRjUHUyJ6gushO2lTNZURcfmaPuas0wxRXsokrO74rxeVT2aAxLJdXfSNNi5yoWN90darpAmqW7x3ChBadZnOMexX8kwBM4aqfkkFmX9xFaseWILbnaxsgcz1gFRUgitxVpPRx8tgdKnWsZGTPtnAqPdBDPNASZ0zFriFILyxUGXb4nAqCQUio8It9XtbL1uudiOvqwe6a2nwR7lpIAUCBePKUjBzWv3r0VI3XXbVVpA8pFckyRdYa8BmAB6ePxhDe-7t6dvyKQOOomfku9iD5Sgsyd44D7Tqws3WGp6Z2jGSQ9SJNDWN-p5JTvY-gOSOxV2DWXWjYEl-zCrwU-BTtcl8MxusPe5uI-ZL0OK8EbTiRYVcFXEXt1Lv1FUTiLbOqJzNCQqSLNZymEUZvVrYWn2rogb_OHuASCILEacv-S6Ags2-_Lhrn8fk1LspCk5415n7usEvFrcvoTb6XOOZYjkWae_-WyMXlGgbfgdmLxKdN-VlIl447dSKKSJ-byZezzovld0qkQ8G_I53yqSpEBNKc4AaA_i4JXuHxWg6NzzxFk8xKLAycp-W2OopZYaz7dmClI5fbujohYOgCtQyobYvgrGAliyY5VncCE5TgNeAuDQsC8wXuZh5ej5PDPpTt9IfOsaKFZz-XJTVjZBZAjA2Npi1jGPeBy--lz0ttGtg16X5XBAwge3kPAB8cE44AuaVQ8zR-GuqUJDQt56y5wpYDDdiWhpcbR96FWcxPWGR3uB6vmhCGIEzroesLb7uKwoVaJWjeDbLgIYQd4ou-ngo6g6jZcBf6spWDGZfadWvyNk9QiYqa-UTZjS8K2dwdYY89j0jihujPOCk-_rt63cGyZuC8OZCK-uyTQy4Oonu2Bot7lykWIycSl9Kkcgu3zV1ziiTNxjRL0E-zg3QOCskr07sHuJ7CJ2a9G06jLHklNCuXY8T0ntwJc-dHzPW-uhNLsNZ7yG9OXyBiS-EQH8xb3Vevnb1eVoZQEZkPbwdz8NXoJWyE9rtnA4-aZhBO6YleNkD1aEhr8ndOfHu9EjAZk9fU2CX3bGTEp_lzsnMqDfpGTYBWWuIdCMxBNwAua3JnmN_cuByY8j92VId57ePPpwyEyIMVjGOMbWJGUACARWoHjTCR7FgPei8xgf14C0aUZmcABIkO5WvuegsCg-HfIy85LJPYiCfXUQ3Rpq98783EkyHJQ07sk1R-pMs_Poc-Th7jWu1EgAkAgR2HiSjCnwaIfVI1xIquzQABzaxTbTo58K6Om1sAcwRaqrjXzNl1IJjCWEPPVIJRAt4isHUl6JmuTs69i9BNWzqZO7QwTxDOAXhh5Dng5kndkZ9-WF7IDw3V5cNf5u8fbbwM_ftSJnJcKjXZErio4qCFn2C8gVTDXAav0dW6mCQ2-pUYNx4AczG70Q1SgScSyTVWFfZYxEr8erufB3o8fJgOWOhINATVUX6gqhvDPwpoxukTWaMtFZ4lujendWbFLDAQcAD2wpLsIxVdYN1GmYVg5e15f02BabREaK1owUMVgjkPJZc5QuAn8iqLsBBPeuKdlGYB7aLGUcAv84o2TWsbbw2Ah_ysvD5DRMjSGMc7Z5UEeYKgkcIpD9LLyaEv8gSz6qJOKPp-bXaUeTlRou4y_VZZ8XpjxTbIh4rIaUJzOpA6lksEB0cHfzhKkQ4Vl1no_t7uBn_hCOUBkpPaEswmD8UhC_mkzbw4Hu5qdWyiElcG9PbB46VFdqroabLY7D0-KyiFQp4XzwXKdZ6yEUxhqFbc2wfY-DEul6syDbiyra7uoaIdZPpSsg-JPd1VEc9ATUXuLjpyQLNIXDl7GPhi_8R761Wyit6RvlVQBpZ35SM5KPhrEmJi2UItwEqxpdLYGL1_hcpOkX7ukz8LCWWEg_UnM3IjCLa-kV3clR3MfdtEOdiNo9Tgok2M-h6N_1C8wfp3xZZ2erwWCA5nHsAeWE4cDeJ__vrDrM-8T0rx_N6ZFuE_V2o0_G1fAltpkJycqtzBDOHkcZAuzSaCJcakml7BaVsKxErBaYplXlfAcDnfYqkLARkNxVqRuE6M4wEpE5sieWsz48xV345Vc5ymIabJ7QfUFjhiqCcjaqOotG90yvqpajsumH4yDjE5MR1m3AjR6e7ZKaOzr0ADnbVxH3Fp2NYVtd3YQn7ayD_oOGjBVl2ETUcXAbUX55ZS19-l-qRXuY29s6aMwv74dUwqCKnZ1GLuZl4_cMnirJK2f0270ubFwVsyoFHB4nS1Pfcx03T0M2RLp0_imV-zkzWL2HRKxIqF6GOVL9dbF8c20w3EF1Z9w3osXrx7ZmnRjNNo36r--edfmZ-5LlbJ_6ncFN_YncQC_lCgqP_g-pD6_v8qp6nGZD_W4ldm-05zAN1ZuCeXWEtChkiElhf8GNxDAlE56i5gHCfRBoPufuhAs1n3rUW2CS5FnsEEwa_CfgN0cROEvO_UE4zMFJ3f_ByQqe-gZWx0_7LuK9ZqMkR5GtZSg-BfcJoPTlwnhL4Aekc9-BNtXOYBjbmtsuuBLW6cKGtE7E55e1MnPAzLdjNIZbD39afDZrKW5TnhiIt1m75vvzQ_c0EEqD8MEXTWzTrnYvJ-AzOmSVSg4GgDO6MSXqFhjyEgVL8nq3UhXRTpxWZTkTYdovgys35UPQ42m_rhpA8s0QxkUQdA-sOryAcy3cXzW9qnUXnOEdnLTT7l71BGJMkwIXlWrCJG1uf-lfm__wMxOksXwgsAAA==';
    private reportPBIURL = 'https://app.powerbi.com/reportEmbed?reportId=6bffeb3c-eecf-450c-93d7-018c0baadd27&autoAuth=true&ctid=ccad5892-5c04-4b6a-bf25-bcd33de90f21';
    private reportID='f6bfd646-b718-44dc-a378-b73e6b528204';


    constructor(props: IPowerBIReportProps) {
        super(props);

        this.VizLoaded = false;
    }

    @autobind
    public componentDidMount() {
        //this.initViz();
    }

    @autobind
    public componentWillReceiveProps(nextProps: IPowerBIReportProps) {
        if (this.Viz && this.VizLoaded && (this.props.height !== nextProps.height || this.props.width !== nextProps.width)) {
            this.Viz.setFrameSize(nextProps.width, nextProps.height);

            // this code re-size frame and reload report within new size...
            // const sheet = this.Viz.getWorkbook().getActiveSheet();
            // sheet.changeSizeAsync({"behavior": "EXACTLY", "maxSize": { "height": nextProps.height, "width": nextProps.width }})
            //     .then(this.Viz.setFrameSize(nextProps.width, nextProps.height));
        }
    }

    @autobind
    public render() { 

        var height = this.props.height + "px";
        var width = this.props.width + "px";

        return ( 
            <div id="vizPlaceholder" className="root">
                <Iframe url="https://app.powerbi.com/reportEmbed?reportId=6bffeb3c-eecf-450c-93d7-018c0baadd27&autoAuth=true&ctid=ccad5892-5c04-4b6a-bf25-bcd33de90f21"
                    width = {width}
                    height= {height}
                    id="myId"
                    className="myClassname"
                    display="inline"
                    position="relative"/>

                

            </div>
         );
    }



    private handleDataSelected = (data) => {
        // will be called when some chart or data element in your report clicked
      }
    
      private handleReportLoad = (report) => {
        // will be called when report loads
    
        this.report = report; // get the object from callback and store it.(optional)
      }
    
      private handlePageChange = (data) => {
        // will be called when pages in your report changes
      }
    
      private handleTileClicked = (dashboard, data) => { // only used when embedType is "dashboard"
        // will be called when report loads
    
        this.report = dashboard; // get the object from callback and store it.(optional)
        console.log('Data from tile', data);
      }

}

export { PowerBIReport };