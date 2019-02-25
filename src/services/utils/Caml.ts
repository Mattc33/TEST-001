import { 
    PermissionKind,
    BasePermissions
} from '@pnp/sp';

export class Caml {

    public static getCaml(
        selectFn?: () => string, 
        whereFn?: () => string,
        rowLimit?: number) {

        const xml = ['<View>'];

        if(rowLimit) xml.push(`<RowLimit>${rowLimit}</RowLimit>`);

        //View Fields
        if(selectFn) xml.push(selectFn());
                
        //Query
        if(whereFn) xml.push(whereFn());

        // Close up all the tags
        xml.push('</View>');

        return xml.join('');

    }

    public static getQueryXmlFrom(where?: () => string, orderBy?: () => string) {

        //Query
        const xml = ['<Query>'];

        if(orderBy) xml.push(`<OrderBy>${orderBy()}</OrderBy>`);
        
        if(where) xml.push(`<Where>${where()}</Where>`);

        // Close up all the tags
        xml.push('</Query>');

        return xml.join('');

    }

}