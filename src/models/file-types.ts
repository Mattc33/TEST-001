import * as _ from 'lodash';

export const FILE_TYPES: Array<string> = [
    'accdb',
    'csv',
    'docx',
    'dotx',
    'mpp',
    'mpt',
    'odp',
    'ods',
    'odt',
    'one',
    'onepkg',
    'onetoc',
    'potx',
    'ppsx',
    'pptx',
    'pub',
    'vsdx',
    'vssx',
    'vstx',
    'xls',
    'xlsx',
    'xltx',
    'xsn',
    'folder',
    'calendar'
];

export const FILE_TYPE_ICONS = {

    'document': {
        class: 'demo-icon icon-doc-text',
        hex: '&#xf0f6;'
    },
    'csv': {
        class: 'demo-icon icon-csv',
        hex: '&#xe100;'
    },
    'docx': {
        class: 'demo-icon icon-word',
        hex: '&#xe10c;'
    },
    'one': {
        class: 'demo-icon icon-doc-text',
        hex: '&#xf0f6;'
    },
    'ppsx': {
        class: 'demo-icon icon-powerpoint',
        hex: '&#xe107;'
    },
    'pptx': {
        class: 'demo-icon icon-powerpoint',
        hex: '&#xe107;'
    },
    'xls': {
        class: 'demo-icon icon-excel',
        hex: '&#xe903;'
    },
    'xlsx': {
        class: 'demo-icon icon-excel',
        hex: '&#xe903;'
    },
    'xltx': {
        class: 'demo-icon icon-excel',
        hex: '&#xe903;'
    },
    'pdf': {
        class: 'demo-icon icon-doc-text',
        hex: '&#xf0f6;'
    },
    'folder': {
        class: 'demo-icon icon-folder-open',
        hex: '&#xf068;'
    },
    'calendar': {
        class: 'demo-icon icon-calendar',
        hex: '&#xe200;'
    },
    'youtube': {
        class: 'demo-icon icon-youtube-img',
        hex: '&#xe10e;'
    },
    'vimeo': {
        class: 'demo-icon icon-vimeo-1',
        hex: '&#xe906;'
    }

};

export const FILE_TYPE_MAPPING = {
    'document': 'far fa-file-alt',
    'csv': 'far fa-file-alt',
    'docx': 'far fa-file-word',
    'one': 'far fa-file-alt',
    'ppsx': 'far fa-file-powerpoint',
    'pptx': 'far fa-file-powerpoint',
    'xls': 'far fa-file-excel',
    'xlsx': 'far fa-file-excel',
    'xltx': 'far fa-file-excel',
    'pdf': 'far fa-file-pdf',
    'folder': 'fas fa-folder',
    'calendar': 'far fa-calendar',
    'youtube': 'fab fa-youtube',
    'vimeo': 'fab fa-vimeo-v'
};

export const GET_FILE_ICON = (extension, className?) => {

    const icon = FILE_TYPE_MAPPING[extension] || FILE_TYPE_MAPPING["document"];
    return icon;
    
};

export const GET_BRANDED_ICON = (extension, size?) => {

    size = size || '16';

    if (extension === 'folder') 
        return 'fas fa-folder';
    const fileIcon = FILE_TYPE_MAPPING[extension] 
        ? FILE_TYPE_MAPPING[extension] : FILE_TYPE_MAPPING['document'];
    
    return fileIcon;
    
};