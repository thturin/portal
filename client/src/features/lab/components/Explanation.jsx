import React from 'react';
import { getImageUrlsFromHtml } from './fetchImages';

export default function Explanation({ content }) {
    if (!content) return null;
    return (
        <div
            className="mt-2 text-sm text-gray-600 explanation"
            dangerouslySetInnerHTML={{ __html: getImageUrlsFromHtml(content) }}
        />
    );
}
