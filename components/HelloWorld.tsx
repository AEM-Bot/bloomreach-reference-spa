import React from 'react';
import { Document, Reference } from '@bloomreach/spa-sdk';
import { BrProps } from '@bloomreach/react-sdk';

interface HelloWorldParameters {
  document?: Reference;
}

export function HelloWorld({ component, page }: BrProps): React.ReactElement | null {
  const { document: documentRef } = component.getModels<HelloWorldParameters>();
  const document = documentRef && page.getContent<Document>(documentRef);

  if (!document) {
    return page.isPreview() ? <div/ > : null;
  }

  const { title } = document.getData<BannerDocument>();

  return (
    <div className="mw-container mx-auto my-4">
      {title && <h3 className="mb-4">{title}</h3>}
    </div>
  );
}
