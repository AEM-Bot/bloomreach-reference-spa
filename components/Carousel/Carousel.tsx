import React from 'react';
import { Document, Reference } from '@bloomreach/spa-sdk';
import { BrManageContentButton, BrProps } from '@bloomreach/react-sdk';

interface CarouselParameters {
    document?: Reference;
    startDate?: string;
    effectiveHourStart?: string;
    effectiveMinuteStart?: string;
    effectiveMeridiemStart?: string;
    endDate?: string;
    effectiveHourEnd?: string;
    effectiveMinuteEnd?: string;
    effectiveMeridiemEnd?: string;
}

export function Carousel({ component, page }: BrProps): React.ReactElement | null {
  const { document: documentRef } = component!.getModels<CarouselParameters>();
  const document = documentRef && page?.getContent<Document>(documentRef);
  if (!document) {
    return page?.isPreview() ? <div/> : null;
  }

  const name = document.getData().displayName;

  const {
    startDate,
    effectiveHourStart,
    effectiveMinuteStart,
    effectiveMeridiemStart,
    endDate,
    effectiveHourEnd,
    effectiveMinuteEnd,
    effectiveMeridiemEnd,
  } = component?.getParameters<CarouselParameters>() || {};

  const formatDate = (dateString?: string) => (
    dateString
      ? new Date(Number(dateString)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      : null
  );

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  return (
        <div
            className={`${
              page?.isPreview() ? 'has-edit-button' : ''
            } mw-container mx-auto my-6 p-4 border border-gray-200 rounded-lg shadow-md bg-white`}
        >
            <BrManageContentButton content={document}/>
            <div className="text-lg font-bold text-blue-600 mb-3">
                {name && <span>Carousel: {name}</span>}
            </div>
            <div className="text-sm text-gray-700">
                {formattedStartDate && (
                    <div>
                        <strong>Start
                            Date:</strong> {formattedStartDate} {effectiveHourStart}:{effectiveMinuteStart}{' '}
                        {effectiveMeridiemStart}
                    </div>
                )}
                {formattedEndDate && (
                    <div>
                        <strong>End Date:</strong> {formattedEndDate} {effectiveHourEnd}:{effectiveMinuteEnd}{' '}
                        {effectiveMeridiemEnd}
                    </div>
                )}
            </div>
        </div>
  );
}
