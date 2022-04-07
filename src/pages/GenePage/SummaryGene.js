import { Button, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import './style.css';
import { SectionHeading } from '../../ot-ui-components';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import {
  parseGeneDescription,
  parseGeneLocation,
  parseGeneBioType,
  getGeneLocusURL,
} from '../../utils';
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
function SummaryGene({ geneId }) {
  const classes = useStyles();
  const { loading, data } = useQuery(GENE_HEADER_QUERY, {
    variables: { geneId },
  });
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const id = '';
  const geneInfo = data?.geneInfo;
  const location = parseGeneLocation(
    geneInfo?.chromosome,
    geneInfo?.start,
    geneInfo?.end
  );
  const locusParams = {
    chromosome: geneInfo?.chromosome,
    start: geneInfo?.start,
    end: geneInfo?.end,
    selectedGene: id,
  };
  const bioType = parseGeneBioType(geneInfo?.bioType);
  const locusURL = getGeneLocusURL(locusParams);
  return (
    <>
      <Button
        variant="success"
        className="sumBut"
        id="summary"
        onClick={handleShow}
      >
        View Summary
      </Button>
      <Modal show={show} onHide={handleClose} id="summaryModal">
        <Modal.Header closeButton>
          <Modal.Title>Gene Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid>
            <div className={classes.sectionContainer}>
              <Typography className={classes.label}>Location</Typography>
              <span>
                {loading ? (
                  <Skeleton width="50vw" />
                ) : (
                  <>
                    <b>GRCh38:</b> {location} (
                    <RouterLink className={classes.link} to={locusURL}>
                      view locus
                    </RouterLink>
                    )
                  </>
                )}
              </span>
            </div>
            <div className={classes.sectionContainer}>
              <Typography className={classes.label}>BioType</Typography>
              {loading ? (
                <Skeleton width="50vw" />
              ) : (
                <>
                  <b>Type:</b> {bioType}
                </>
              )}
            </div>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SummaryGene;
