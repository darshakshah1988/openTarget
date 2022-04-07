import React from 'react';
import { faDna } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/core';

import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import BaseHeader, { OTButtonLink } from '../../components/Header';
import { ExternalLink } from '../../components/ExternalLink';

import {
  parseGeneDescription,
  parseGeneLocation,
  parseGeneBioType,
  getGeneLocusURL,
} from '../../utils';
import SummaryGene from './SummaryGene';

const GENE_HEADER_QUERY = loader('./GeneHeader.gql');

const useStyles = makeStyles(theme => ({
  sectionContainer: {
    marginBottom: '20px',
    '& span': {
      display: 'block',
    },
  },
  label: {
    marginBottom: '5px',
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
}));

function Header({ geneId }) {
  const classes = useStyles();
  const { loading, data } = useQuery(GENE_HEADER_QUERY, {
    variables: { geneId },
  });

  const geneInfo = data?.geneInfo;
  const id = geneInfo?.id;
  const symbol = geneInfo?.symbol;
  const description = parseGeneDescription(geneInfo?.description);
  const location = parseGeneLocation(
    geneInfo?.chromosome,
    geneInfo?.start,
    geneInfo?.end
  );
  const bioType = parseGeneBioType(geneInfo?.bioType);
  const locusParams = {
    chromosome: geneInfo?.chromosome,
    start: geneInfo?.start,
    end: geneInfo?.end,
    selectedGene: id,
  };
  const locusURL = getGeneLocusURL(locusParams);

  return (
    <>
      <BaseHeader
        title={symbol}
        loading={loading}
        Icon={faDna}
        subtitle={description}
        externalLinks={
          <>
            <ExternalLink
              title="Ensembl"
              url={`https://identifiers.org/ensembl:${id}`}
              id={id}
            />
            <ExternalLink
              title="gnomAD"
              url={`http://gnomad.broadinstitute.org/gene/${id}`}
              id={id}
            />
            <ExternalLink
              title="GTEx"
              url={`https://identifiers.org/gtex:${symbol}`}
              id={symbol}
            />
            <ExternalLink
              title="GeneCards"
              url={`https://identifiers.org/genecards:${symbol}`}
              id={symbol}
            />
            <SummaryGene id={geneId} />
          </>
        }
      >
        {!loading && <OTButtonLink symbol={symbol} id={id} />}
      </BaseHeader>
    </>
  );
}

export default Header;
