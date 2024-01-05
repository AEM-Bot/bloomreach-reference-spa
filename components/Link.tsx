/* eslint-disable jsx-a11y/anchor-has-content */
/*
 * Copyright 2020-2024 Bloomreach
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import NextLink from 'next/link';

export const Link = React.forwardRef(
  ({ href, ...props }: React.ComponentPropsWithoutRef<'a'>, ref: React.Ref<HTMLAnchorElement>) =>
    (href ? (
      <NextLink href={href}>
        <a ref={ref} {...props} />
      </NextLink>
    ) : (
      <a ref={ref} {...props} />
    )),
);
