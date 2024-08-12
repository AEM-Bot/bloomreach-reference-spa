import React from 'react';
import { BrProps } from '@bloomreach/react-sdk';

interface HelloWorldParameters {
  title?: string;
}

export function HelloWorld({ component, page }: BrProps): React.ReactElement | null {
  const { title } = component!.getParameters<HelloWorldParameters>();

  return (
    <div className="mw-container mx-auto my-4">
      {title && <h3 className="mb-4">{title}</h3>}
    </div>
  );
}
