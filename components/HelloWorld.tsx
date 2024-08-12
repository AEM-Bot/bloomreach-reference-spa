import React from 'react';
import { Image } from 'react-bootstrap';
import { Document, Reference, ImageSet } from '@bloomreach/spa-sdk';
import { BrManageContentButton, BrProps } from '@bloomreach/react-sdk';

interface HelloWorldParameters {
  document?: Reference;
}

export function HelloWorld({ component, page }: BrProps): React.ReactElement | null {
  const { document: documentRef } = component!.getModels<HelloWorldParameters>();
  const document = documentRef && page!.getContent<Document>(documentRef);

  if (!document) {
    return page!.isPreview() ? <div /> : null;
  }

  const { content, image: imageRef, title } = document.getData<BannerDocument>();
  const image = imageRef && page?.getContent<ImageSet>(imageRef)?.getOriginal();

  return (
    <div className={`${page!.isPreview() ? 'has-edit-button' : ''} mw-container mx-auto my-4`}>
      <BrManageContentButton content={document} />
      {title && <h3 className="mb-4">{title}</h3>}
      {image && (
        <div className="mb-4">
          <Image className="d-block w-100 h-100" src={image.getUrl()} alt={title} />
        </div>
      )}
      {content && <div dangerouslySetInnerHTML={{ __html: page!.rewriteLinks(content.value) }} />}
    </div>
  );
}
