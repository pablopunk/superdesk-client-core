import {ISuperdesk, IExtension, IRestApiResponse} from 'superdesk-api';
import {getAnnotationInputWithKnowledgeBase} from './AnnotationInputWithKnowledgeBase';
import {getAnnotationsLibraryPage} from './annotations-library-page';
import {getFields} from './GetFields';
import {IKnowledgeBaseItem} from './interfaces';

function annotationFromLibraryTabSelectedByDefault(
    superdesk: ISuperdesk,
    annotationText: string,
    mode: 'create' | 'edit',
) {
    const {dataApi} = superdesk;
    const {assertNever} = superdesk.helpers;
    const {nameField} = getFields(superdesk);
    const {generateFilterForServer} = superdesk.forms;

    if (mode === 'edit') {
        return Promise.resolve(false);
    } else if (mode === 'create') {
        return dataApi.query<IKnowledgeBaseItem>(
            'concept_items',
            1,
            {field: 'name', direction: 'ascending'},
            {name: generateFilterForServer(nameField.type, annotationText)},
        ).then((res: IRestApiResponse<IKnowledgeBaseItem>) => res._items.length > 0);
    } else {
        return assertNever(mode);
    }
}

var extension: IExtension = {
    activate: (superdesk: ISuperdesk) => {
        const {gettext} = superdesk.localization;

        return Promise.resolve({
            contributions: {
                editor3: {
                    annotationInputTabs: [
                        {
                            label: gettext('Annotations library'),
                            component: getAnnotationInputWithKnowledgeBase(superdesk),
                            selectedByDefault: (annotationText: string, mode: 'create' | 'edit') =>
                                annotationFromLibraryTabSelectedByDefault(superdesk, annotationText, mode),
                        },
                    ],
                    onAnnotationUpdate(annotation) {
                        alert(annotation);
                    },
                },
                pages: [
                    {
                        title: gettext('Annotations library'),
                        url: '/annotations-library',
                        component: getAnnotationsLibraryPage(superdesk),
                    },
                ],
            },
        });
    },
};

export default extension;
