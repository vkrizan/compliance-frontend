import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import {
    Grid
} from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle, Main } from '@redhat-cloud-services/frontend-components';
import { ComplianceEmptyState } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import {
    BackgroundLink,
    ErrorPage,
    LoadingPoliciesTable,
    StateView,
    StateViewPart
} from 'PresentationalComponents';

import {
    PoliciesTable
} from 'SmartComponents';

const QUERY = gql`
{
    profiles(search: "external = false and canonical = false") {
        edges {
            node {
                id
                name
                refId
                complianceThreshold
                totalHostCount
                majorOsVersion
                benchmark {
                    id
                    title
                    version
                }
                businessObjective {
                    id
                    title
                }
            }
        }
    }
}
`;

export const CompliancePolicies = () => {
    const location = useLocation();
    const createLink = <BackgroundLink to='/scappolicies/new'>Create new policy</BackgroundLink>;
    let { data, error, loading, refetch } = useQuery(QUERY);
    useEffect(() => { refetch(); }, [location]);
    let policies;

    if (data) {
        error = undefined; loading = undefined;
        policies = data.profiles.edges.map(profile => profile.node);
    }

    return <React.Fragment>
        <PageHeader className='page-header'>
            <PageHeaderTitle title="SCAP policies" />
        </PageHeader>
        <Main>
            <StateView stateValues={ { error, data, loading } }>
                <StateViewPart stateKey='error'>
                    <ErrorPage error={error}/>
                </StateViewPart>
                <StateViewPart stateKey='loading'>
                    <LoadingPoliciesTable />
                </StateViewPart>
                <StateViewPart stateKey='data'>
                    { policies && policies.length === 0 ?
                        <Grid hasGutter><ComplianceEmptyState title='No policies'
                            mainButton={ createLink } /></Grid> :
                        <PoliciesTable policies={ policies } />
                    }
                </StateViewPart>
            </StateView>
        </Main>
    </React.Fragment>;
};

export default CompliancePolicies;
