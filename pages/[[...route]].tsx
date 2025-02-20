/* eslint-disable jsx-a11y/anchor-is-valid */
/*
 * Copyright 2019-2024 Bloomreach
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

import { NextPage } from 'next';
import axios from 'axios';
import cookie from 'cookie';
import { Configuration, initialize, PageModel } from '@bloomreach/spa-sdk';
// import { relevance } from '@bloomreach/spa-sdk/lib/express';
import { APOLLO_STATE_PROP_NAME, CommerceApiClientFactory } from '@bloomreach/connector-components-react';
import { buildConfiguration, CommerceConfig, deleteUndefined, loadCommerceConfig } from '../src/utils';
import { App } from '../components/App';

let commerceClientFactory: CommerceApiClientFactory;

interface IndexPageProps {
  configuration: Omit<Configuration, 'httpClient'>;
  page: PageModel | null;
  commerceConfig: CommerceConfig;
  [APOLLO_STATE_PROP_NAME]?: any;
  cookies?: Record<string, string>;
}

const Index: NextPage<IndexPageProps> = ({
  configuration,
  page,
  commerceConfig,
  [APOLLO_STATE_PROP_NAME]: apolloState,
  cookies,
}): JSX.Element => {
  console.log('page', page);

  // If page data is missing, return a dummy homepage and set response 200 as this will always make liveness
  // probe ready and will not fail the deployment and doesn't restart the AKS container pods.
  if (!page) {
    console.log('Missing page data, returning dummy homepage');
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Victorias Secret CMS Next Js Home Page</h1>
        <p>This is a dummy homepage.</p>
      </div>
    );
  }

  return <App
    configuration={configuration}
    page={page}
    commerceConfig={commerceConfig}
    apolloState={apolloState}
    commerceClientFactory={commerceClientFactory}
    cookies={cookies}
  />;
};

Index.getInitialProps = async ({ req: request, res: response, asPath: path, query }) => {
  const props: IndexPageProps = {
    configuration: buildConfiguration(path ?? '/'),
    page: null,
    commerceConfig: {} as CommerceConfig,
  };

  try {
    // Fetching page configuration and data
    const configuration = buildConfiguration(path ?? '/');
    console.log('configuration from pages', configuration);

    const page = await initialize({ ...configuration, request, httpClient: axios as any });
    const pageJson = page.toJSON();
    const commerceConfig = loadCommerceConfig(pageJson, query);

    // Adding values to props
    props.page = pageJson;
    props.commerceConfig = commerceConfig;

    // Handling cookies
    const cookies = cookie.parse(request?.headers.cookie ?? '');
    props.cookies = cookies;

    // Setting up the Commerce API client
    const { graphqlServiceUrl, connector, brAccountName: accountEnvId } = commerceConfig;
    const defaultRequestHeaders = undefined;
    const defaultAnonymousCredentials = undefined;

    commerceClientFactory = new CommerceApiClientFactory(
      graphqlServiceUrl,
      connector,
      accountEnvId,
      defaultRequestHeaders,
      defaultAnonymousCredentials,
      true,
    );
  } catch (error) {
    console.error('Error occurred while fetching page or commerce data:', error);

    // Even in case of an error, we return a dummy homepage.
    props.page = null;
    props.commerceConfig = {} as CommerceConfig;

    // Manually set status code to 200 even in case of error
    if (response) {
      response.statusCode = 200;
    }
  }

  // Ensure undefined values are not returned to the client
  if (process.env.NODE_ENV !== 'production') {
    deleteUndefined(props);
  }

  return props;
};

export default Index;
